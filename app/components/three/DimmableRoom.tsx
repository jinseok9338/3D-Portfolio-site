import { useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSceneStore } from '~/stores/useSceneStore';
import type { Group, Mesh, MeshStandardMaterial, Color } from 'three';
import type { RoomId } from '~/types';

type DimmableRoomProps = {
  children: ReactNode;
  roomId: RoomId;
};

// 원본 색상 저장용 (mesh별로 저장)
type OriginalMaterialData = { color: Color; emissive: Color };

/**
 * 클릭 불가능한 방 (거실, 욕실 등)
 * activeRoom이 설정되면 dim 처리됨
 */
export function DimmableRoom({ children, roomId }: DimmableRoomProps) {
  const groupRef = useRef<Group>(null);
  const originalColorsRef = useRef<Map<Mesh, OriginalMaterialData[]>>(new Map());
  const prevDimmedRef = useRef<boolean | null>(null);
  const initRef = useRef(false);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    // 초기화: 원본 색상 저장
    if (!initRef.current) {
      group.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh;
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          const originalData: OriginalMaterialData[] = [];

          materials.forEach((mat) => {
            if ((mat as MeshStandardMaterial).isMeshStandardMaterial) {
              const material = mat as MeshStandardMaterial;
              originalData.push({
                color: material.color.clone(),
                emissive: material.emissive.clone(),
              });
            }
          });

          if (originalData.length > 0) {
            originalColorsRef.current.set(mesh, originalData);
          }
        }
      });
      initRef.current = true;
    }

    // store에서 직접 최신 값 가져오기
    const activeRoom = useSceneStore.getState().activeRoom;
    const isDimmed = activeRoom !== null;

    // 상태 변경 없으면 스킵
    if (prevDimmedRef.current === isDimmed) return;
    prevDimmedRef.current = isDimmed;

    // dim 효과 적용
    group.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const originalData = originalColorsRef.current.get(mesh);

        if (!originalData) return;

        materials.forEach((mat, idx) => {
          if ((mat as MeshStandardMaterial).isMeshStandardMaterial && originalData[idx]) {
            const material = mat as MeshStandardMaterial;
            const original = originalData[idx];

            if (isDimmed) {
              material.color.copy(original.color).multiplyScalar(0.3);
              material.emissive.setHex(0x000000);
            } else {
              material.color.copy(original.color);
              material.emissive.copy(original.emissive);
            }
          }
        });
      }
    });
  });

  return <group ref={groupRef}>{children}</group>;
}

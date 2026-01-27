import { useState, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSceneStore } from '~/stores/useSceneStore';
import { ROOM_CONFIG } from './roomConfig';
import type { Group, Mesh, MeshStandardMaterial, Color } from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import type { SectionId, RoomId } from '~/types';

type InteractiveObjectProps = {
  children: ReactNode;
  section: SectionId | null; // null = 특별한 방 (이스터에그, 갤러리 등)
  roomId?: RoomId;
  disabled?: boolean;
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
};

// 원본 색상 저장용 (mesh별로 저장)
type OriginalMaterialData = { color: Color; emissive: Color };

export function InteractiveObject({
  children,
  section,
  roomId,
  disabled = false,
  onClick,
  onHover,
}: InteractiveObjectProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const { setActiveSection, setActiveRoom, setCameraTarget } = useSceneStore();
  const originalColorsRef = useRef<Map<Mesh, OriginalMaterialData[]>>(new Map());
  const prevDimmedRef = useRef<boolean | null>(null);

  // 원본 색상 저장 (최초 1회)
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
    const isDimmed = activeRoom !== null && activeRoom !== roomId;

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

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (disabled) return;
    e.stopPropagation();
    setHovered(true);
    onHover?.(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    if (disabled) return;
    e.stopPropagation();
    setHovered(false);
    onHover?.(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (disabled) return;
    e.stopPropagation();

    console.log('=== Room Clicked ===');
    console.log('roomId:', roomId);
    console.log('section:', section);

    setActiveSection(section);

    if (roomId) {
      setActiveRoom(roomId);
      const config = ROOM_CONFIG[roomId];
      console.log('config:', config);
      if (config) {
        setCameraTarget({
          position: config.cameraPosition,
          target: config.cameraTarget,
        });
      }
    }

    onClick?.();
  };

  return (
    <group
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {children}
    </group>
  );
}

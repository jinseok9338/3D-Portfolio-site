import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';
import { InteractiveObject } from './InteractiveObject';
import { DimmableRoom } from './DimmableRoom';
import { ROOM_CONFIG } from './roomConfig';
import type { RoomId } from '~/types';
import type { Object3D, Mesh, MeshStandardMaterial } from 'three';

type RoomsModelProps = ThreeElements['group'];

// Scene_1 노드를 찾는 헬퍼 함수
function findScene1(obj: Object3D): Object3D | null {
  if (obj.name === 'Scene_1') return obj;
  for (const child of obj.children) {
    const found = findScene1(child);
    if (found) return found;
  }
  return null;
}

// 모든 material을 clone하는 헬퍼 함수
function cloneWithMaterials(obj: Object3D): Object3D {
  const cloned = obj.clone();

  cloned.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mesh = child as Mesh;
      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((mat) => mat.clone());
      } else if (mesh.material) {
        mesh.material = mesh.material.clone();
      }
    }
  });

  return cloned;
}

export function RoomsModel(props: RoomsModelProps) {
  const { scene } = useGLTF('/models/low_poly_isometric_rooms.glb');

  // Scene_1의 children (Room들)을 찾고, material을 미리 clone
  const rooms = useMemo(() => {
    const scene1 = findScene1(scene);
    if (!scene1) return [];

    // 각 방을 deep clone (material 포함)
    return scene1.children.map((child) => cloneWithMaterials(child));
  }, [scene]);

  return (
    <group {...props}>
      {rooms.map((child) => {
        const roomId = child.name as RoomId;
        const config = ROOM_CONFIG[roomId];

        // 섹션이 매핑된 방: 클릭 가능 + dim 효과
        if (config?.section) {
          return (
            <InteractiveObject
              key={child.name}
              section={config.section}
              roomId={roomId}
            >
              <primitive object={child} />
            </InteractiveObject>
          );
        }

        // 섹션 없는 방 (거실, 욕실): 클릭 불가 + dim 효과만
        return (
          <DimmableRoom key={child.name} roomId={roomId}>
            <primitive object={child} />
          </DimmableRoom>
        );
      })}
    </group>
  );
}

// 하위 호환성을 위한 alias
export const OfficeModel = RoomsModel;

useGLTF.preload('/models/low_poly_isometric_rooms.glb');

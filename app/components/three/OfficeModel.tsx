import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';
import { InteractiveObject } from './InteractiveObject';
import { ROOM_CONFIG } from './roomConfig';
import type { RoomId } from '~/types';
import type { Object3D } from 'three';

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

export function RoomsModel(props: RoomsModelProps) {
  const { scene } = useGLTF('/models/low_poly_isometric_rooms.glb');

  // Scene_1의 children (Room들)을 찾음
  const rooms = useMemo(() => {
    const scene1 = findScene1(scene);
    return scene1?.children || [];
  }, [scene]);

  return (
    <group {...props}>
      {rooms.map((child) => {
        const roomId = child.name as RoomId;
        const config = ROOM_CONFIG[roomId];

        // 섹션이 매핑된 방만 인터랙티브
        if (config?.section) {
          return (
            <InteractiveObject
              key={child.name}
              section={config.section}
              roomId={roomId}
            >
              <primitive object={child.clone()} />
            </InteractiveObject>
          );
        }

        // 매핑 안된 방은 그냥 렌더 (거실, 욕실 등)
        return <primitive key={child.name} object={child.clone()} />;
      })}
    </group>
  );
}

// 하위 호환성을 위한 alias
export const OfficeModel = RoomsModel;

useGLTF.preload('/models/low_poly_isometric_rooms.glb');

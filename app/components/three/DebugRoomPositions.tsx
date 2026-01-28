import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Vector3 } from 'three';
import type { Object3D } from 'three';

// Scene_1 노드를 찾는 헬퍼 함수
function findScene1(obj: Object3D): Object3D | null {
  if (obj.name === 'Scene_1') return obj;
  for (const child of obj.children) {
    const found = findScene1(child);
    if (found) return found;
  }
  return null;
}

// OfficeModel과 동일한 스케일/위치 적용
const MODEL_SCALE = 0.003;
const MODEL_OFFSET_Y = 0;

/**
 * 각 방의 월드 좌표를 콘솔에 출력하는 디버그 컴포넌트
 * Production에서는 렌더링하지 않음
 */
export function DebugRoomPositions() {
  // Production에서는 아무것도 하지 않음
  if (import.meta.env.PROD) {
    return null;
  }

  return <DebugRoomPositionsContent />;
}

function DebugRoomPositionsContent() {
  const { scene } = useGLTF('/models/low_poly_isometric_rooms.glb');

  useEffect(() => {
    const scene1 = findScene1(scene);
    if (!scene1) {
      console.log('Scene_1 not found');
      return;
    }

    console.log('=== Room World Coordinates (scale=0.01, y-1) ===');

    scene1.children.forEach((room) => {
      const box = new Box3().setFromObject(room);
      const center = new Vector3();
      const size = new Vector3();
      box.getCenter(center);
      box.getSize(size);

      // 스케일과 오프셋 적용
      const worldCenter = {
        x: center.x * MODEL_SCALE,
        y: center.y * MODEL_SCALE + MODEL_OFFSET_Y,
        z: center.z * MODEL_SCALE,
      };
      const worldSize = {
        x: size.x * MODEL_SCALE,
        y: size.y * MODEL_SCALE,
        z: size.z * MODEL_SCALE,
      };

      // 카메라 위치 제안: 방 중심에서 비스듬히 위/앞에서 바라봄
      const camPos = {
        x: worldCenter.x + worldSize.x * 0.8,
        y: worldCenter.y + worldSize.y * 1.5,
        z: worldCenter.z - worldSize.z * 1.2,
      };

      console.log(`${room.name}:`);
      console.log(`  worldCenter: [${worldCenter.x.toFixed(3)}, ${worldCenter.y.toFixed(3)}, ${worldCenter.z.toFixed(3)}]`);
      console.log(`  worldSize: [${worldSize.x.toFixed(3)}, ${worldSize.y.toFixed(3)}, ${worldSize.z.toFixed(3)}]`);
      console.log(`  cameraPosition: [${camPos.x.toFixed(3)}, ${camPos.y.toFixed(3)}, ${camPos.z.toFixed(3)}]`);
      console.log(`  cameraTarget: [${worldCenter.x.toFixed(3)}, ${worldCenter.y.toFixed(3)}, ${worldCenter.z.toFixed(3)}]`);
    });
  }, [scene]);

  return null;
}

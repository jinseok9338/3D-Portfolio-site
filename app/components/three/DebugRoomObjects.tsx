import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import type { Object3D, Mesh } from 'three';

type DebugRoomObjectsProps = {
  roomName?: string; // 특정 방만 분석하려면 지정
};

// Scene_1 노드를 찾는 헬퍼 함수
function findNode(obj: Object3D, name: string): Object3D | null {
  if (obj.name === name) return obj;
  for (const child of obj.children) {
    const found = findNode(child, name);
    if (found) return found;
  }
  return null;
}

/**
 * GLB 모델의 오브젝트 구조를 콘솔에 출력하는 디버그 컴포넌트
 * Production에서는 렌더링하지 않음
 */
export function DebugRoomObjects({ roomName }: DebugRoomObjectsProps) {
  // Production에서는 아무것도 하지 않음
  if (import.meta.env.PROD) {
    return null;
  }

  return <DebugRoomObjectsContent roomName={roomName} />;
}

function DebugRoomObjectsContent({ roomName }: DebugRoomObjectsProps) {
  const { scene } = useGLTF('/models/low_poly_isometric_rooms.glb');

  useEffect(() => {
    const scene1 = findNode(scene, 'Scene_1');
    if (!scene1) {
      console.log('Scene_1 not found');
      return;
    }

    const rooms = roomName
      ? [findNode(scene1, roomName)].filter(Boolean) as Object3D[]
      : scene1.children;

    rooms.forEach((room) => {
      console.log(`\n=== ${room.name} 오브젝트 구조 ===`);

      const printTree = (obj: Object3D, indent = '') => {
        const isMesh = (obj as Mesh).isMesh;
        const meshInfo = isMesh ? ' [MESH]' : '';
        const childCount = obj.children.length > 0 ? ` (${obj.children.length} children)` : '';

        console.log(`${indent}${obj.name || '(unnamed)'}${meshInfo}${childCount}`);

        obj.children.forEach(child => printTree(child, indent + '  '));
      };

      printTree(room);

      // 클릭 가능한 주요 오브젝트 후보 출력
      console.log(`\n--- ${room.name} 주요 오브젝트 목록 ---`);
      const meshes: string[] = [];
      room.traverse((child) => {
        if ((child as Mesh).isMesh && child.name) {
          meshes.push(child.name);
        }
      });
      console.log(meshes.join(', '));
    });
  }, [scene, roomName]);

  return null;
}

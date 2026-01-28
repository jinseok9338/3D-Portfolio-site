import { useEffect, useCallback, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useSceneStore } from '~/stores/useSceneStore';
import { ROOM2_INTERACTIVE_MESHES, ROOM2_OBJECT_MESHES, getMeshObjectId } from './config';
import type { Room2ObjectId } from '~/types';
import type { Mesh, MeshStandardMaterial } from 'three';
import { Color } from 'three';

const HOVER_EMISSIVE = new Color(0x00ffff); // 시안색
const DEFAULT_EMISSIVE = new Color(0x000000); // 검정 (발광 없음)
const EMISSIVE_INTENSITY = 0.3;

// Hover 시 표시할 간단한 레이블
const HOVER_LABELS: Record<Room2ObjectId, string> = {
  laptop: '프로젝트',
  corkboard: '진행 중',
  bookshelf: '기술 스택',
};

/**
 * Room2 (Projects) 내부의 클릭 가능한 오브젝트들을 처리
 * - 노트북, 코르크보드, 책장에 클릭 이벤트 추가
 * - 클릭 시 말풍선 표시
 * - Hover 시 커서 변경 및 Emissive 효과
 */
export function Room2InteractiveObjects() {
  const { scene, camera, raycaster, pointer } = useThree();
  const activeRoom = useSceneStore((state) => state.activeRoom);
  const activeObject = useSceneStore((state) => state.activeObject);
  const objectPosition = useSceneStore((state) => state.objectPosition);
  const hoveredObject = useSceneStore((state) => state.hoveredObject);
  const hoverPosition = useSceneStore((state) => state.hoverPosition);
  const setActiveObject = useSceneStore((state) => state.setActiveObject);
  const clearObject = useSceneStore((state) => state.clearObject);
  const setHoveredObject = useSceneStore((state) => state.setHoveredObject);

  const lastHoveredRef = useRef<Room2ObjectId | null>(null);
  const highlightedMeshesRef = useRef<Mesh[]>([]);

  // Emissive 효과 적용/해제 헬퍼
  const setMeshEmissive = useCallback((meshes: Mesh[], highlight: boolean) => {
    meshes.forEach((mesh) => {
      const material = mesh.material as MeshStandardMaterial;
      if (material && 'emissive' in material) {
        material.emissive = highlight ? HOVER_EMISSIVE : DEFAULT_EMISSIVE;
        material.emissiveIntensity = highlight ? EMISSIVE_INTENSITY : 0;
      }
    });
  }, []);

  // 오브젝트 ID로 메시들 찾기
  const findMeshesByObjectId = useCallback((objectId: Room2ObjectId): Mesh[] => {
    const meshNames = ROOM2_OBJECT_MESHES[objectId];
    if (!meshNames) return [];

    const meshes: Mesh[] = [];
    scene.traverse((child) => {
      if ((child as Mesh).isMesh && meshNames.includes(child.name)) {
        meshes.push(child as Mesh);
      }
    });
    return meshes;
  }, [scene]);

  // 매 프레임마다 hover 체크 (useFrame으로 최적화)
  useFrame(() => {
    const state = useSceneStore.getState();
    if (state.activeRoom !== 'Room2') {
      // Room2가 아니면 하이라이트 해제
      if (lastHoveredRef.current !== null) {
        setMeshEmissive(highlightedMeshesRef.current, false);
        highlightedMeshesRef.current = [];
        state.setHoveredObject(null);
        lastHoveredRef.current = null;
        document.body.style.cursor = 'default';
      }
      return;
    }

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    let foundObjectId: Room2ObjectId | null = null;
    let hoverPos: [number, number, number] | undefined;

    for (const intersect of intersects) {
      const meshName = intersect.object.name;
      if (ROOM2_INTERACTIVE_MESHES.has(meshName)) {
        foundObjectId = getMeshObjectId(meshName);
        hoverPos = intersect.point.toArray() as [number, number, number];
        break;
      }
    }

    // 변경이 있을 때만 업데이트
    if (foundObjectId !== lastHoveredRef.current) {
      // 이전 하이라이트 해제
      setMeshEmissive(highlightedMeshesRef.current, false);

      // 새 하이라이트 적용
      if (foundObjectId) {
        const meshes = findMeshesByObjectId(foundObjectId);
        setMeshEmissive(meshes, true);
        highlightedMeshesRef.current = meshes;
      } else {
        highlightedMeshesRef.current = [];
      }

      lastHoveredRef.current = foundObjectId;
      state.setHoveredObject(foundObjectId, hoverPos);
      document.body.style.cursor = foundObjectId ? 'pointer' : 'default';
    }
  });

  // 클릭 핸들러
  const handleClick = useCallback(() => {
    // Room2가 아니면 무시
    if (useSceneStore.getState().activeRoom !== 'Room2') return;

    // Raycaster로 클릭된 오브젝트 찾기
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (const intersect of intersects) {
      const meshName = intersect.object.name;

      if (ROOM2_INTERACTIVE_MESHES.has(meshName)) {
        const objectId = getMeshObjectId(meshName);
        if (objectId) {
          const currentActiveObject = useSceneStore.getState().activeObject;
          // 같은 오브젝트를 다시 클릭하면 닫기
          if (currentActiveObject === objectId) {
            clearObject();
          } else {
            // 오브젝트의 월드 좌표 가져오기
            const position = intersect.point.toArray() as [number, number, number];
            setActiveObject(objectId, position);
          }
          return;
        }
      }
    }

    // 다른 곳 클릭 시 닫기
    clearObject();
  }, [raycaster, pointer, camera, scene, setActiveObject, clearObject]);

  // 이벤트 리스너 등록
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    canvas.addEventListener('click', handleClick);
    return () => {
      canvas.removeEventListener('click', handleClick);
      document.body.style.cursor = 'default';
    };
  }, [handleClick]);

  // Room2가 아니면 아무것도 렌더링 안 함
  if (activeRoom !== 'Room2') {
    return null;
  }

  const isRoom2Hovered = hoveredObject && ['laptop', 'corkboard', 'bookshelf'].includes(hoveredObject);

  return (
    <>
      {/* Hover 시 간단한 레이블 표시 (클릭된 오브젝트가 없을 때만) */}
      {isRoom2Hovered && hoverPosition && !activeObject && (
        <Html
          position={[hoverPosition[0], hoverPosition[1] + 0.15, hoverPosition[2]]}
          center
          distanceFactor={1.5}
          style={{ pointerEvents: 'none' }}
        >
          <div className="px-2 py-1 bg-background/90 backdrop-blur-sm border border-primary/50 rounded text-xs text-foreground whitespace-nowrap">
            {HOVER_LABELS[hoveredObject as Room2ObjectId]}
          </div>
        </Html>
      )}
      {/* 클릭 시 drawer가 열림 (home.tsx에서 처리) */}
    </>
  );
}

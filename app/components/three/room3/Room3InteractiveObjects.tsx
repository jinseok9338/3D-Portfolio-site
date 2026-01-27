import { useEffect, useCallback, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useSceneStore } from '~/stores/useSceneStore';
import { ROOM3_INTERACTIVE_MESHES, ROOM3_OBJECT_MESHES, getMeshObjectId, HOVER_LABELS } from './config';
import type { Room3ObjectId } from '~/types';
import type { Mesh, MeshStandardMaterial } from 'three';
import { Color } from 'three';

const HOVER_EMISSIVE = new Color(0x00ff00); // 초록색 (이스터에그용)
const DEFAULT_EMISSIVE = new Color(0x000000);
const EMISSIVE_INTENSITY = 0.4;

/**
 * Room3 (거실) TV 이스터에그
 * - TV 클릭 시 EmulatorJS 모달 표시
 */
export function Room3InteractiveObjects() {
  const { scene, camera, raycaster, pointer } = useThree();
  const activeRoom = useSceneStore((state) => state.activeRoom);
  const hoveredObject = useSceneStore((state) => state.hoveredObject);
  const hoverPosition = useSceneStore((state) => state.hoverPosition);
  const setHoveredObject = useSceneStore((state) => state.setHoveredObject);

  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const lastHoveredRef = useRef<Room3ObjectId | null>(null);
  const highlightedMeshesRef = useRef<Mesh[]>([]);

  // Emissive 효과 적용/해제
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
  const findMeshesByObjectId = useCallback((objectId: Room3ObjectId): Mesh[] => {
    const meshNames = ROOM3_OBJECT_MESHES[objectId];
    if (!meshNames) return [];

    const meshes: Mesh[] = [];
    scene.traverse((child) => {
      if ((child as Mesh).isMesh && meshNames.includes(child.name)) {
        meshes.push(child as Mesh);
      }
    });
    return meshes;
  }, [scene]);

  // Hover 체크
  useFrame(() => {
    const state = useSceneStore.getState();
    if (state.activeRoom !== 'Room3') {
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

    let foundObjectId: Room3ObjectId | null = null;
    let hoverPos: [number, number, number] | undefined;

    for (const intersect of intersects) {
      const meshName = intersect.object.name;
      if (ROOM3_INTERACTIVE_MESHES.has(meshName)) {
        foundObjectId = getMeshObjectId(meshName);
        hoverPos = intersect.point.toArray() as [number, number, number];
        break;
      }
    }

    if (foundObjectId !== lastHoveredRef.current) {
      setMeshEmissive(highlightedMeshesRef.current, false);

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
    if (useSceneStore.getState().activeRoom !== 'Room3') return;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (const intersect of intersects) {
      const meshName = intersect.object.name;
      if (ROOM3_INTERACTIVE_MESHES.has(meshName)) {
        const objectId = getMeshObjectId(meshName);
        if (objectId === 'tv') {
          setShowEasterEgg(true);
        }
        return;
      }
    }
  }, [raycaster, pointer, camera, scene]);

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    canvas.addEventListener('click', handleClick);
    return () => {
      canvas.removeEventListener('click', handleClick);
      document.body.style.cursor = 'default';
    };
  }, [handleClick]);

  if (activeRoom !== 'Room3') {
    return null;
  }

  const isRoom3Hovered = hoveredObject === 'tv';

  return (
    <>
      {/* Hover 레이블 */}
      {isRoom3Hovered && hoverPosition && !showEasterEgg && (
        <Html
          position={[hoverPosition[0], hoverPosition[1] + 0.15, hoverPosition[2]]}
          center
          distanceFactor={1.5}
          style={{ pointerEvents: 'none' }}
        >
          <div className="px-2 py-1 bg-background/90 backdrop-blur-sm border border-green-500/50 rounded text-xs text-foreground whitespace-nowrap">
            {HOVER_LABELS.tv}
          </div>
        </Html>
      )}

      {/* 이스터에그 모달 (3D 공간 외부에서 렌더링) */}
      {showEasterEgg && (
        <Html fullscreen>
          <EasterEggModal onClose={() => setShowEasterEgg(false)} />
        </Html>
      )}
    </>
  );
}

// 이스터에그 모달 컴포넌트
function EasterEggModal({ onClose }: { onClose: () => void }) {
  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="relative bg-background border border-border rounded-lg p-6 max-w-2xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* 헤더 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">🎮 이스터에그를 발견했습니다!</h2>
          <p className="text-muted-foreground">TV를 클릭하셨네요. 숨겨진 게임을 찾아주셔서 감사합니다!</p>
        </div>

        {/* 게임 영역 (placeholder) */}
        <div className="aspect-video bg-black rounded-lg flex items-center justify-center border border-border">
          <div className="text-center">
            <p className="text-green-400 text-lg mb-2">🕹️ Retro Game Zone</p>
            <p className="text-muted-foreground text-sm">EmulatorJS가 여기에 로드됩니다</p>
            <p className="text-muted-foreground text-xs mt-2">(ROM 파일 추가 후 활성화)</p>
          </div>
        </div>

        {/* 안내 */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>ESC 또는 바깥 클릭으로 닫기</p>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useCallback, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useSceneStore } from '~/stores/useSceneStore';
import { ROOM6_INTERACTIVE_MESHES, ROOM6_OBJECT_MESHES, getMeshObjectId, HOVER_LABELS, GALLERY_IMAGES } from './config';
import type { Room6ObjectId } from '~/types';
import type { Mesh, MeshStandardMaterial } from 'three';
import { Color } from 'three';

const HOVER_EMISSIVE = new Color(0xff69b4); // 핑크색 (갤러리용)
const DEFAULT_EMISSIVE = new Color(0x000000);
const EMISSIVE_INTENSITY = 0.3;

/**
 * Room6 (욕실) 갤러리
 * - 거울/액자 클릭 시 갤러리 모달 표시
 */
export function Room6InteractiveObjects() {
  const { scene, camera, raycaster, pointer } = useThree();
  const activeRoom = useSceneStore((state) => state.activeRoom);
  const hoveredObject = useSceneStore((state) => state.hoveredObject);
  const hoverPosition = useSceneStore((state) => state.hoverPosition);
  const setHoveredObject = useSceneStore((state) => state.setHoveredObject);

  const [showGallery, setShowGallery] = useState(false);
  const lastHoveredRef = useRef<Room6ObjectId | null>(null);
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
  const findMeshesByObjectId = useCallback((objectId: Room6ObjectId): Mesh[] => {
    const meshNames = ROOM6_OBJECT_MESHES[objectId];
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
    if (state.activeRoom !== 'Room6') {
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

    let foundObjectId: Room6ObjectId | null = null;
    let hoverPos: [number, number, number] | undefined;

    for (const intersect of intersects) {
      const meshName = intersect.object.name;
      if (ROOM6_INTERACTIVE_MESHES.has(meshName)) {
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
    if (useSceneStore.getState().activeRoom !== 'Room6') return;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (const intersect of intersects) {
      const meshName = intersect.object.name;
      if (ROOM6_INTERACTIVE_MESHES.has(meshName)) {
        setShowGallery(true);
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

  if (activeRoom !== 'Room6') {
    return null;
  }

  const isRoom6Hovered = hoveredObject && ['mirror', 'pictures'].includes(hoveredObject);

  return (
    <>
      {/* Hover 레이블 */}
      {isRoom6Hovered && hoverPosition && !showGallery && (
        <Html
          position={[hoverPosition[0], hoverPosition[1] + 0.15, hoverPosition[2]]}
          center
          distanceFactor={1.5}
          style={{ pointerEvents: 'none' }}
        >
          <div className="px-2 py-1 bg-background/90 backdrop-blur-sm border border-pink-500/50 rounded text-xs text-foreground whitespace-nowrap">
            {HOVER_LABELS[hoveredObject as Room6ObjectId]}
          </div>
        </Html>
      )}

      {/* 갤러리 모달 */}
      {showGallery && (
        <Html fullscreen>
          <GalleryModal onClose={() => setShowGallery(false)} />
        </Html>
      )}
    </>
  );
}

// 갤러리 모달 컴포넌트
function GalleryModal({ onClose }: { onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : GALLERY_IMAGES.length - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev < GALLERY_IMAGES.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* 이미지 영역 */}
        <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center border border-white/10">
          <div className="text-center">
            <p className="text-pink-400 text-lg mb-2">🖼️ Gallery</p>
            <p className="text-white/70 text-sm">이미지가 여기에 표시됩니다</p>
            <p className="text-white/50 text-xs mt-2">{currentIndex + 1} / {GALLERY_IMAGES.length}</p>
          </div>
        </div>

        {/* 네비게이션 */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : GALLERY_IMAGES.length - 1))}
            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
          >
            ← 이전
          </button>
          <div className="flex gap-2">
            {GALLERY_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-pink-500' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentIndex((prev) => (prev < GALLERY_IMAGES.length - 1 ? prev + 1 : 0))}
            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
          >
            다음 →
          </button>
        </div>

        {/* 안내 */}
        <div className="mt-4 text-center text-sm text-white/50">
          <p>← → 키로 이동 | ESC로 닫기</p>
        </div>
      </div>
    </div>
  );
}

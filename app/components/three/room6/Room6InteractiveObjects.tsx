import { useEffect, useCallback, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useSceneStore } from '~/stores/useSceneStore';
import { ROOM6_INTERACTIVE_MESHES, ROOM6_OBJECT_MESHES, getMeshObjectId, HOVER_LABELS } from './config';
import type { Room6ObjectId } from '~/types';
import type { Mesh, MeshStandardMaterial } from 'three';
import { Color } from 'three';

const HOVER_EMISSIVE = new Color(0xff69b4); // 핑크색 (갤러리용)
const DEFAULT_EMISSIVE = new Color(0x000000);
const EMISSIVE_INTENSITY = 0.3;

/**
 * Room6 (욕실) 갤러리
 * - 거울/액자 클릭 시 갤러리 모달 표시 (store를 통해)
 */
export function Room6InteractiveObjects() {
  const { scene, camera, raycaster, pointer } = useThree();
  const activeRoom = useSceneStore((state) => state.activeRoom);
  const activeModal = useSceneStore((state) => state.activeModal);
  const hoveredObject = useSceneStore((state) => state.hoveredObject);
  const hoverPosition = useSceneStore((state) => state.hoverPosition);
  const setHoveredObject = useSceneStore((state) => state.setHoveredObject);
  const setActiveModal = useSceneStore((state) => state.setActiveModal);

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
        setActiveModal('gallery');
        return;
      }
    }
  }, [raycaster, pointer, camera, scene, setActiveModal]);

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
  const isModalOpen = activeModal !== null;

  return (
    <>
      {/* Hover 레이블 */}
      {isRoom6Hovered && hoverPosition && !isModalOpen && (
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
    </>
  );
}

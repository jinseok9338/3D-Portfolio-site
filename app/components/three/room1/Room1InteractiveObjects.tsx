import { useEffect, useCallback, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useSceneStore } from '~/stores/useSceneStore';
import { ROOM1_INTERACTIVE_MESHES, ROOM1_OBJECT_MESHES, getMeshObjectId, ROOM1_CONTENTS } from './config';
import type { Room1ObjectId } from '~/types';
import type { Mesh, MeshStandardMaterial } from 'three';
import { Color } from 'three';

const HOVER_EMISSIVE = new Color(0x00ffff); // 시안색
const DEFAULT_EMISSIVE = new Color(0x000000); // 검정 (발광 없음)
const EMISSIVE_INTENSITY = 0.3;

/**
 * Room1 (About) 내부의 클릭 가능한 오브젝트들을 처리
 * - 컴퓨터, 책상, 선반, 망원경에 클릭 이벤트 추가
 * - 클릭 시 말풍선 표시
 * - Hover 시 커서 변경 및 Emissive 효과
 */
export function Room1InteractiveObjects() {
  const { scene, camera, raycaster, pointer } = useThree();
  const activeRoom = useSceneStore((state) => state.activeRoom);
  const activeObject = useSceneStore((state) => state.activeObject);
  const objectPosition = useSceneStore((state) => state.objectPosition);
  const setActiveObject = useSceneStore((state) => state.setActiveObject);
  const clearObject = useSceneStore((state) => state.clearObject);
  const setHoveredObject = useSceneStore((state) => state.setHoveredObject);

  const lastHoveredRef = useRef<Room1ObjectId | null>(null);
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
  const findMeshesByObjectId = useCallback((objectId: Room1ObjectId): Mesh[] => {
    const meshNames = ROOM1_OBJECT_MESHES[objectId];
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
    if (state.activeRoom !== 'Room1') {
      // Room1이 아니면 하이라이트 해제
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

    let foundObjectId: Room1ObjectId | null = null;

    for (const intersect of intersects) {
      const meshName = intersect.object.name;
      if (ROOM1_INTERACTIVE_MESHES.has(meshName)) {
        foundObjectId = getMeshObjectId(meshName);
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
      state.setHoveredObject(foundObjectId);
      document.body.style.cursor = foundObjectId ? 'pointer' : 'default';
    }
  });

  // 클릭 핸들러
  const handleClick = useCallback(() => {
    // Room1이 아니면 무시
    if (useSceneStore.getState().activeRoom !== 'Room1') return;

    // Raycaster로 클릭된 오브젝트 찾기
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (const intersect of intersects) {
      const meshName = intersect.object.name;

      if (ROOM1_INTERACTIVE_MESHES.has(meshName)) {
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

  // Room1이 아니거나 선택된 오브젝트가 없으면 렌더링 안 함
  if (activeRoom !== 'Room1' || !activeObject || !objectPosition) {
    return null;
  }

  const content = ROOM1_CONTENTS[activeObject];

  return (
    <Html
      position={[objectPosition[0], objectPosition[1] + 0.3, objectPosition[2]]}
      center
      distanceFactor={2}
      style={{
        pointerEvents: 'auto',
      }}
    >
      <ObjectTooltip content={content} onClose={clearObject} />
    </Html>
  );
}

// 말풍선 컴포넌트
function ObjectTooltip({
  content,
  onClose,
}: {
  content: typeof ROOM1_CONTENTS[Room1ObjectId];
  onClose: () => void;
}) {
  return (
    <div
      className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-xl p-4 min-w-[250px] max-w-[320px]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground">{content.title}</h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* 설명 */}
      {content.description && (
        <p className="text-sm text-muted-foreground mb-3">{content.description}</p>
      )}

      {/* 아이템 리스트 (경력용) */}
      {content.items && (
        <ul className="space-y-2 mb-3">
          {content.items.map((item, idx) => (
            <li key={idx} className="text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <br />
              <span className="text-foreground">{item.value}</span>
            </li>
          ))}
        </ul>
      )}

      {/* 태그 (기술 스택용) */}
      {content.tags && (
        <div className="flex flex-wrap gap-1.5">
          {content.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 링크 (소셜용) */}
      {content.links && (
        <div className="flex gap-2 mt-3">
          {content.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

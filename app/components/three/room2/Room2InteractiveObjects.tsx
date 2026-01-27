import { useEffect, useCallback, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useSceneStore } from '~/stores/useSceneStore';
import { ROOM2_INTERACTIVE_MESHES, ROOM2_OBJECT_MESHES, getMeshObjectId, ROOM2_CONTENTS } from './config';
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
  const isRoom2Active = activeObject && ['laptop', 'corkboard', 'bookshelf'].includes(activeObject);

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

      {/* 클릭 시 상세 말풍선 표시 */}
      {isRoom2Active && objectPosition && (
        <Html
          position={[objectPosition[0], objectPosition[1] + 0.3, objectPosition[2]]}
          center
          distanceFactor={2}
          style={{ pointerEvents: 'auto' }}
        >
          <ObjectTooltip
            content={ROOM2_CONTENTS[activeObject as Room2ObjectId]}
            onClose={clearObject}
          />
        </Html>
      )}
    </>
  );
}

// 말풍선 컴포넌트
function ObjectTooltip({
  content,
  onClose,
}: {
  content: typeof ROOM2_CONTENTS[Room2ObjectId];
  onClose: () => void;
}) {
  return (
    <div
      className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-xl p-4 min-w-[280px] max-w-[360px]"
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

      {/* 프로젝트 리스트 */}
      {content.projects && (
        <div className="space-y-3 mb-3">
          {content.projects.map((project, idx) => (
            <div key={idx} className="p-2 bg-muted/50 rounded-md">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{project.name}</span>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    View →
                  </a>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{project.description}</p>
              {project.tech && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {project.tech.map((t) => (
                    <span key={t} className="px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 아이템 리스트 */}
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

      {/* 링크 */}
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

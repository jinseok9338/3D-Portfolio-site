import { useMemo } from 'react';
import { getIsMobile } from '~/hooks/useIsMobile';

export function Lighting() {
  const isMobile = useMemo(() => getIsMobile(), []);

  return (
    <>
      {/* 전체적인 부드러운 조명 */}
      <ambientLight intensity={isMobile ? 0.5 : 0.4} />

      {/* 메인 조명 (태양) - 모바일에서 그림자 비활성화 */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow={!isMobile}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* 보조 조명 (반대편에서 부드럽게) */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
      />

      {/* 하단 반사광 */}
      <hemisphereLight
        args={['#b1e1ff', '#b97a20', 0.3]}
      />
    </>
  );
}

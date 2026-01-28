import { useMemo } from 'react';
import { Environment as DreiEnvironment } from '@react-three/drei';
import { getIsMobile } from '~/hooks/useIsMobile';

export function Environment() {
  const isMobile = useMemo(() => getIsMobile(), []);

  return (
    <>
      {/* 배경색 */}
      <color attach="background" args={['#0a0f1a']} />

      {/* 안개 효과 (깊이감) - 모바일에서 더 가까운 안개 */}
      <fog attach="fog" args={['#0a0f1a', isMobile ? 15 : 20, isMobile ? 60 : 80]} />

      {/* HDR 환경맵 (반사/조명용) - 데스크탑만 */}
      {!isMobile && <DreiEnvironment preset="night" />}
    </>
  );
}

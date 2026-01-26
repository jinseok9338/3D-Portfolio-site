import { Environment as DreiEnvironment } from '@react-three/drei';

export function Environment() {
  return (
    <>
      {/* 배경색 */}
      <color attach="background" args={['#0a0f1a']} />

      {/* 안개 효과 (깊이감) */}
      <fog attach="fog" args={['#0a0f1a', 20, 80]} />

      {/* HDR 환경맵 (반사/조명용) */}
      <DreiEnvironment preset="night" />
    </>
  );
}

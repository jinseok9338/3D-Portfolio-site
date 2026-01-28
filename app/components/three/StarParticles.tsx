import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random';
import type { Points as PointsType } from 'three';
import { getIsMobile } from '~/hooks/useIsMobile';

type StarParticlesProps = {
  count?: number;
  radius?: number;
  speed?: number;
};

export function StarParticles({
  count = 2000,
  radius = 50,
  speed = 0.3,
}: StarParticlesProps) {
  const ref = useRef<PointsType>(null);
  const isMobile = useMemo(() => getIsMobile(), []);

  // 모바일에서 파티클 수 대폭 감소
  const actualCount = isMobile ? Math.min(count, 500) : count;

  // 랜덤 위치 생성 (구 형태로 분포)
  const positions = useMemo(() => {
    const arr = new Float32Array(actualCount * 3);
    random.inSphere(arr, { radius });
    return arr;
  }, [actualCount, radius]);

  useFrame((_, delta) => {
    if (ref.current) {
      // 천천히 회전
      ref.current.rotation.x -= delta * speed * 0.1;
      ref.current.rotation.y -= delta * speed * 0.15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={isMobile ? 0.12 : 0.08}
          sizeAttenuation
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

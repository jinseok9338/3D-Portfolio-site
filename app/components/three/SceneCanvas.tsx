import { Canvas, type CanvasProps } from '@react-three/fiber';
import { Preload, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { Suspense, type ReactNode, useMemo } from 'react';
import { SceneLoader } from './SceneLoader';
import { getIsMobile } from '~/hooks/useIsMobile';

type SceneCanvasProps = Omit<CanvasProps, 'children'> & {
  children: ReactNode;
  paused?: boolean;
};

export function SceneCanvas({ children, paused = false, ...props }: SceneCanvasProps) {
  // 초기 렌더링 시 모바일 여부 결정 (Canvas 생성 시점에만)
  const isMobile = useMemo(() => getIsMobile(), []);

  return (
    <Canvas
      dpr={isMobile ? 1 : [1, 2]}
      frameloop={paused ? 'demand' : 'always'}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
        // 모바일에서 추가 최적화
        ...(isMobile && {
          precision: 'mediump',
          stencil: false,
          depth: true,
        }),
      }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 100,
        position: [0, 2, -5],
      }}
      {...props}
    >
      <Suspense fallback={<SceneLoader />}>
        {children}
        <Preload all />
      </Suspense>
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  );
}

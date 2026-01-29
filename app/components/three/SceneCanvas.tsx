import { Canvas, type CanvasProps } from '@react-three/fiber';
import { Preload, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { Suspense, type ReactNode } from 'react';
import { SceneLoader } from './SceneLoader';

type SceneCanvasProps = Omit<CanvasProps, 'children'> & {
  children: ReactNode;
};

export function SceneCanvas({ children, ...props }: SceneCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
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

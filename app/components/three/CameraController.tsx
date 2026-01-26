import { useRef, type ElementRef } from 'react';
import { OrbitControls } from '@react-three/drei';

type CameraControllerProps = {
  enableZoom?: boolean;
  enablePan?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

export function CameraController({
  enableZoom = true,
  enablePan = false,
  autoRotate = false,
  autoRotateSpeed = 0.5,
}: CameraControllerProps) {
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);

  // TODO: 카메라 전환 애니메이션 (Phase 5에서 구현)

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={enableZoom}
      enablePan={enablePan}
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      minDistance={3}
      maxDistance={30}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2}
    />
  );
}

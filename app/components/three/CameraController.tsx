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
  return (
    <OrbitControls
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

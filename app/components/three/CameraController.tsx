import { useRef, useEffect, type ElementRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';
import { useSceneStore } from '~/stores/useSceneStore';

type CameraControllerProps = {
  enableZoom?: boolean;
  enablePan?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

// 각 섹션별 카메라 위치 설정
const CAMERA_POSITIONS: Record<string, { position: Vector3; target: Vector3 }> = {
  about: {
    position: new Vector3(5, 2, 5),
    target: new Vector3(0, 0, 0),
  },
  projects: {
    position: new Vector3(-5, 3, 4),
    target: new Vector3(0, 0, 0),
  },
  skills: {
    position: new Vector3(0, 5, 6),
    target: new Vector3(0, 0, 0),
  },
  contact: {
    position: new Vector3(4, 2, -5),
    target: new Vector3(0, 0, 0),
  },
  default: {
    position: new Vector3(8, 4, 8),
    target: new Vector3(0, 0, 0),
  },
};

const TRANSITION_SPEED = 2;

export function CameraController({
  enableZoom = true,
  enablePan = false,
  autoRotate = false,
  autoRotateSpeed = 0.5,
}: CameraControllerProps) {
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);
  const { camera } = useThree();

  const activeSection = useSceneStore((state) => state.activeSection);
  const setIsTransitioning = useSceneStore((state) => state.setIsTransitioning);

  const targetPosition = useRef(new Vector3());
  const targetLookAt = useRef(new Vector3());
  const isAnimating = useRef(false);

  // 섹션 변경 시 타겟 위치 설정
  useEffect(() => {
    const config = activeSection
      ? CAMERA_POSITIONS[activeSection]
      : CAMERA_POSITIONS.default;

    if (config) {
      targetPosition.current.copy(config.position);
      targetLookAt.current.copy(config.target);
      isAnimating.current = true;
      setIsTransitioning(true);
    }
  }, [activeSection, setIsTransitioning]);

  // 카메라 애니메이션
  useFrame((_, delta) => {
    if (!isAnimating.current || !controlsRef.current) return;

    const speed = delta * TRANSITION_SPEED;

    // 카메라 위치 보간
    camera.position.lerp(targetPosition.current, speed);

    // OrbitControls 타겟 보간
    controlsRef.current.target.lerp(targetLookAt.current, speed);
    controlsRef.current.update();

    // 도착 확인 (충분히 가까우면 애니메이션 종료)
    const positionDistance = camera.position.distanceTo(targetPosition.current);
    const targetDistance = controlsRef.current.target.distanceTo(targetLookAt.current);

    if (positionDistance < 0.01 && targetDistance < 0.01) {
      isAnimating.current = false;
      setIsTransitioning(false);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={enableZoom}
      enablePan={enablePan}
      autoRotate={autoRotate && !isAnimating.current}
      autoRotateSpeed={autoRotateSpeed}
      minDistance={3}
      maxDistance={30}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2}
    />
  );
}

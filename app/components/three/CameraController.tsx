import { useRef, useEffect, type ElementRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useSceneStore } from '~/stores/useSceneStore';
import * as THREE from 'three';

type CameraControllerProps = {
  enableZoom?: boolean;
  enablePan?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  transitionDuration?: number;
};

// 기본 카메라 위치 (전체 뷰)
const DEFAULT_CAMERA = {
  position: new THREE.Vector3(0, 2, -5),
  target: new THREE.Vector3(0, 0, 0),
};

export function CameraController({
  enableZoom = true,
  enablePan = false,
  autoRotate = false,
  autoRotateSpeed = 0.5,
  transitionDuration = 1.5,
}: CameraControllerProps) {
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);
  const { camera } = useThree();

  const cameraTarget = useSceneStore((state) => state.cameraTarget);
  const isTransitioning = useSceneStore((state) => state.isTransitioning);
  const setIsTransitioning = useSceneStore((state) => state.setIsTransitioning);

  // 애니메이션 상태
  const animationRef = useRef({
    startPosition: new THREE.Vector3(),
    endPosition: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    progress: 0,
    isAnimating: false,
  });

  // 카메라 타겟이 변경되면 애니메이션 시작
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const anim = animationRef.current;

    // 현재 카메라 위치와 타겟 저장
    anim.startPosition.copy(camera.position);
    anim.startTarget.copy(controls.target);

    if (cameraTarget) {
      // 특정 방으로 줌인
      anim.endPosition.set(...cameraTarget.position);
      anim.endTarget.set(...cameraTarget.target);
    } else {
      // 기본 위치로 복귀
      anim.endPosition.copy(DEFAULT_CAMERA.position);
      anim.endTarget.copy(DEFAULT_CAMERA.target);
    }

    // 애니메이션 시작
    anim.progress = 0;
    anim.isAnimating = true;
    setIsTransitioning(true);
  }, [cameraTarget, camera, setIsTransitioning]);

  // 프레임마다 애니메이션 업데이트
  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    const anim = animationRef.current;
    if (!anim.isAnimating) return;

    // 진행률 업데이트
    anim.progress += delta / transitionDuration;

    if (anim.progress >= 1) {
      // 애니메이션 완료
      anim.progress = 1;
      anim.isAnimating = false;
      setIsTransitioning(false);
    }

    // easeInOutCubic 이징
    const t = anim.progress;
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // 카메라 위치 보간
    camera.position.lerpVectors(anim.startPosition, anim.endPosition, ease);

    // 타겟 위치 보간
    controls.target.lerpVectors(anim.startTarget, anim.endTarget, ease);
    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={enableZoom && !isTransitioning}
      enablePan={enablePan && !isTransitioning}
      enableRotate={!isTransitioning}
      autoRotate={autoRotate && !isTransitioning}
      autoRotateSpeed={autoRotateSpeed}
      minDistance={0.05}
      maxDistance={10}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2}
    />
  );
}

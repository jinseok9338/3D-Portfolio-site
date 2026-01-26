import { useGLTF } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';

type OfficeModelProps = ThreeElements['group'];

export function OfficeModel(props: OfficeModelProps) {
  const { scene } = useGLTF('/models/low_poly_isometric_rooms.glb');

  return (
    <primitive
      object={scene}
      {...props}
    />
  );
}

// 모델 프리로드
useGLTF.preload('/models/low_poly_isometric_rooms.glb');

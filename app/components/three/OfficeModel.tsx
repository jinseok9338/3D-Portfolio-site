import { useGLTF } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';

type OfficeModelProps = ThreeElements['group'];

export function OfficeModel(props: OfficeModelProps) {
  const { scene } = useGLTF('/models/office.glb');

  return (
    <primitive
      object={scene}
      {...props}
    />
  );
}

// 모델 프리로드
useGLTF.preload('/models/office.glb');

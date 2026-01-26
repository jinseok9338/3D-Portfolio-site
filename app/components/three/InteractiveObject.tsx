import { useState, useRef, type ReactNode } from 'react';
import { useSceneStore } from '~/stores/useSceneStore';
import type { Group } from 'three';
import type { ThreeEvent } from '@react-three/fiber';

type SectionType = 'about' | 'projects' | 'skills' | 'contact';

type InteractiveObjectProps = {
  children: ReactNode;
  section: SectionType;
  disabled?: boolean;
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
};

export function InteractiveObject({
  children,
  section,
  disabled = false,
  onClick,
  onHover,
}: InteractiveObjectProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const setActiveSection = useSceneStore((state) => state.setActiveSection);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (disabled) return;
    e.stopPropagation();
    setHovered(true);
    onHover?.(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    if (disabled) return;
    e.stopPropagation();
    setHovered(false);
    onHover?.(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (disabled) return;
    e.stopPropagation();
    setActiveSection(section);
    onClick?.();
  };

  return (
    <group
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {children}
    </group>
  );
}

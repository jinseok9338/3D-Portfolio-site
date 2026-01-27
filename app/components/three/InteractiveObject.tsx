import { useState, useRef, type ReactNode } from 'react';
import { useSceneStore } from '~/stores/useSceneStore';
import { ROOM_CONFIG } from './roomConfig';
import type { Group } from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import type { SectionId, RoomId } from '~/types';

type InteractiveObjectProps = {
  children: ReactNode;
  section: SectionId;
  roomId?: RoomId;
  disabled?: boolean;
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
};

export function InteractiveObject({
  children,
  section,
  roomId,
  disabled = false,
  onClick,
  onHover,
}: InteractiveObjectProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const { setActiveSection, setActiveRoom, setCameraTarget } = useSceneStore();

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

    console.log('=== Room Clicked ===');
    console.log('roomId:', roomId);
    console.log('section:', section);

    setActiveSection(section);

    if (roomId) {
      setActiveRoom(roomId);
      const config = ROOM_CONFIG[roomId];
      console.log('config:', config);
      if (config) {
        setCameraTarget({
          position: config.cameraPosition,
          target: config.cameraTarget,
        });
      }
    }

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

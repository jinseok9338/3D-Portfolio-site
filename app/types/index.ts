// Section types for 3D portfolio
export type SectionId = 'about' | 'projects' | 'skills' | 'contact' | 'hobby';

export type Section = {
  id: SectionId;
  label: string;
  position: [number, number, number];
};

// Room configuration for camera targeting
export type RoomConfig = {
  section: SectionId | null;
  label: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
};

export type RoomId = 'Room1' | 'Room2' | 'Room3' | 'Room4' | 'Room5' | 'Room6' | 'Room7';

// Common utility types
export type PropsWithClassName<T = unknown> = T & {
  className?: string;
};

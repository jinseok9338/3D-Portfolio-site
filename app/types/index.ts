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

// Room1 (About) 내부 클릭 가능한 오브젝트
export type Room1ObjectId = 'computer' | 'desk' | 'shelf' | 'telescope';

// 오브젝트 콘텐츠 타입
export type ObjectContent = {
  id: Room1ObjectId;
  title: string;
  description?: string;
  items?: Array<{ label: string; value: string }>;
  links?: Array<{ label: string; url: string; icon?: string }>;
  tags?: string[];
};

// Common utility types
export type PropsWithClassName<T = unknown> = T & {
  className?: string;
};

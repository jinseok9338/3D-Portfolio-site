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

// Room2 (Projects) 내부 클릭 가능한 오브젝트
export type Room2ObjectId = 'laptop' | 'corkboard' | 'bookshelf';

// Room3 (거실) 이스터에그 오브젝트
export type Room3ObjectId = 'tv';

// Room6 (욕실) 갤러리 오브젝트
export type Room6ObjectId = 'mirror' | 'pictures';

// 모든 방의 오브젝트 ID 통합
export type RoomObjectId = Room1ObjectId | Room2ObjectId | Room3ObjectId | Room6ObjectId;

// 오브젝트 콘텐츠 타입
export type ObjectContent<T extends string = string> = {
  id: T;
  title: string;
  description?: string;
  items?: Array<{ label: string; value: string }>;
  links?: Array<{ label: string; url: string; icon?: string }>;
  tags?: string[];
  // 프로젝트용 추가 필드
  projects?: Array<{
    name: string;
    description: string;
    tech?: string[];
    link?: string;
  }>;
};

// Common utility types
export type PropsWithClassName<T = unknown> = T & {
  className?: string;
};

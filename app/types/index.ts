// Section types for 3D portfolio
export type SectionId = 'about' | 'projects' | 'skills' | 'contact';

export type Section = {
  id: SectionId;
  label: string;
  position: [number, number, number];
};

// Common utility types
export type PropsWithClassName<T = unknown> = T & {
  className?: string;
};

import { create } from 'zustand';
import type { RoomId, SectionId } from '~/types';

type SectionType = SectionId | null;

type CameraTarget = {
  position: [number, number, number];
  target: [number, number, number];
} | null;

type SceneState = {
  activeSection: SectionType;
  activeRoom: RoomId | null;
  cameraTarget: CameraTarget;
  isTransitioning: boolean;
};

type SceneActions = {
  setActiveSection: (section: SectionType) => void;
  setActiveRoom: (room: RoomId | null) => void;
  setCameraTarget: (target: CameraTarget) => void;
  clearSection: () => void;
  setIsTransitioning: (isTransitioning: boolean) => void;
  reset: () => void;
};

const initialState: SceneState = {
  activeSection: null,
  activeRoom: null,
  cameraTarget: null,
  isTransitioning: false,
};

export const useSceneStore = create<SceneState & SceneActions>((set) => ({
  ...initialState,

  setActiveSection: (section) => set({ activeSection: section }),

  setActiveRoom: (room) => set({ activeRoom: room }),

  setCameraTarget: (target) => set({ cameraTarget: target }),

  clearSection: () => set({ activeSection: null, activeRoom: null, cameraTarget: null }),

  setIsTransitioning: (isTransitioning) => set({ isTransitioning }),

  reset: () => set(initialState),
}));

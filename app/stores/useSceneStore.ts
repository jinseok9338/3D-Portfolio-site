import { create } from 'zustand';

type SectionType = 'about' | 'projects' | 'skills' | 'contact' | null;

type SceneState = {
  activeSection: SectionType;
  isTransitioning: boolean;
};

type SceneActions = {
  setActiveSection: (section: SectionType) => void;
  clearSection: () => void;
  setIsTransitioning: (isTransitioning: boolean) => void;
  reset: () => void;
};

const initialState: SceneState = {
  activeSection: null,
  isTransitioning: false,
};

export const useSceneStore = create<SceneState & SceneActions>((set) => ({
  ...initialState,

  setActiveSection: (section) => set({ activeSection: section }),

  clearSection: () => set({ activeSection: null }),

  setIsTransitioning: (isTransitioning) => set({ isTransitioning }),

  reset: () => set(initialState),
}));

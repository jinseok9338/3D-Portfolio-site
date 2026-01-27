import { create } from 'zustand';
import type { RoomId, SectionId, Room1ObjectId } from '~/types';

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
  // Room1 내부 오브젝트 선택 상태
  activeObject: Room1ObjectId | null;
  objectPosition: [number, number, number] | null; // 말풍선 위치용
  // Hover 상태
  hoveredObject: Room1ObjectId | null;
};

type SceneActions = {
  setActiveSection: (section: SectionType) => void;
  setActiveRoom: (room: RoomId | null) => void;
  setCameraTarget: (target: CameraTarget) => void;
  clearSection: () => void;
  setIsTransitioning: (isTransitioning: boolean) => void;
  // Room1 내부 오브젝트 액션
  setActiveObject: (objectId: Room1ObjectId | null, position?: [number, number, number]) => void;
  clearObject: () => void;
  setHoveredObject: (objectId: Room1ObjectId | null) => void;
  reset: () => void;
};

const initialState: SceneState = {
  activeSection: null,
  activeRoom: null,
  cameraTarget: null,
  isTransitioning: false,
  activeObject: null,
  objectPosition: null,
  hoveredObject: null,
};

export const useSceneStore = create<SceneState & SceneActions>((set) => ({
  ...initialState,

  setActiveSection: (section) => set({ activeSection: section }),

  setActiveRoom: (room) => set({ activeRoom: room }),

  setCameraTarget: (target) => set({ cameraTarget: target }),

  clearSection: () => set({
    activeSection: null,
    activeRoom: null,
    cameraTarget: null,
    activeObject: null,
    objectPosition: null,
  }),

  setIsTransitioning: (isTransitioning) => set({ isTransitioning }),

  setActiveObject: (objectId, position) => set({
    activeObject: objectId,
    objectPosition: position || null
  }),

  clearObject: () => set({ activeObject: null, objectPosition: null }),

  setHoveredObject: (objectId) => set({ hoveredObject: objectId }),

  reset: () => set(initialState),
}));

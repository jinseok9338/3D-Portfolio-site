import { create } from 'zustand';
import type { RoomId, SectionId, RoomObjectId } from '~/types';

type SectionType = SectionId | null;

type CameraTarget = {
  position: [number, number, number];
  target: [number, number, number];
} | null;

type ModalType = 'easter-egg' | 'gallery' | null;

type SceneState = {
  activeSection: SectionType;
  activeRoom: RoomId | null;
  cameraTarget: CameraTarget;
  isTransitioning: boolean;
  // Room 내부 오브젝트 선택 상태
  activeObject: RoomObjectId | null;
  objectPosition: [number, number, number] | null; // 말풍선 위치용
  // Hover 상태
  hoveredObject: RoomObjectId | null;
  hoverPosition: [number, number, number] | null;
  // 모달 상태 (R3F 외부에서 렌더링)
  activeModal: ModalType;
};

type SceneActions = {
  setActiveSection: (section: SectionType) => void;
  setActiveRoom: (room: RoomId | null) => void;
  setCameraTarget: (target: CameraTarget) => void;
  clearSection: () => void;
  setIsTransitioning: (isTransitioning: boolean) => void;
  // Room 내부 오브젝트 액션
  setActiveObject: (objectId: RoomObjectId | null, position?: [number, number, number]) => void;
  clearObject: () => void;
  closeDrawer: () => void; // drawer만 닫기 (방 유지)
  setHoveredObject: (objectId: RoomObjectId | null, position?: [number, number, number]) => void;
  setActiveModal: (modal: ModalType) => void;
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
  hoverPosition: null,
  activeModal: null,
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

  // drawer만 닫기 (방에 머물러 있음)
  closeDrawer: () => set({ activeObject: null, objectPosition: null }),

  setHoveredObject: (objectId, position) => set({
    hoveredObject: objectId,
    hoverPosition: position || null,
  }),

  setActiveModal: (modal) => set({ activeModal: modal }),

  reset: () => set(initialState),
}));

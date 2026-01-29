import { useEffect, useRef } from 'react';
import { useSceneStore } from '~/stores/useSceneStore';

/**
 * Android 뒤로가기 버튼 처리
 * - 모달 열려있으면 → 모달 닫기
 * - Drawer 열려있으면 → Drawer 닫기
 * - 방에 줌인 되어있으면 → 홈으로
 */
export function useAndroidBackButton() {
  const activeModal = useSceneStore((state) => state.activeModal);
  const activeObject = useSceneStore((state) => state.activeObject);
  const activeRoom = useSceneStore((state) => state.activeRoom);
  const setActiveModal = useSceneStore((state) => state.setActiveModal);
  const closeDrawer = useSceneStore((state) => state.closeDrawer);
  const clearSection = useSceneStore((state) => state.clearSection);

  // 현재 상태를 ref로 추적 (popstate 핸들러에서 최신 값 참조)
  const stateRef = useRef({ activeModal, activeObject, activeRoom });

  useEffect(() => {
    stateRef.current = { activeModal, activeObject, activeRoom };
  }, [activeModal, activeObject, activeRoom]);

  // Android 감지
  const isAndroid = typeof navigator !== 'undefined' &&
    /android/i.test(navigator.userAgent);

  useEffect(() => {
    if (!isAndroid) return;

    // 상태 변경 시 history에 state 푸시
    const hasState = activeModal || activeObject || activeRoom;

    if (hasState) {
      // 현재 URL 유지하면서 state만 푸시
      window.history.pushState({ appState: true }, '');
    }
  }, [isAndroid, activeModal, activeObject, activeRoom]);

  useEffect(() => {
    if (!isAndroid) return;

    const handlePopState = (e: PopStateEvent) => {
      const { activeModal, activeObject, activeRoom } = stateRef.current;

      // 앱 상태가 있으면 뒤로가기 처리
      if (activeModal) {
        // 모달 닫기
        e.preventDefault();
        setActiveModal(null);
        // 상태 유지를 위해 다시 푸시
        if (activeObject || activeRoom) {
          window.history.pushState({ appState: true }, '');
        }
        return;
      }

      if (activeObject) {
        // Drawer 닫기
        e.preventDefault();
        closeDrawer();
        // 방에 있으면 상태 유지
        if (activeRoom) {
          window.history.pushState({ appState: true }, '');
        }
        return;
      }

      if (activeRoom) {
        // 홈으로 돌아가기
        e.preventDefault();
        clearSection();
        return;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAndroid, setActiveModal, closeDrawer, clearSection]);
}

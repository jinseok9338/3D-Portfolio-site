import { describe, it, expect, beforeEach } from 'vitest';
import { useSceneStore } from '~/stores/useSceneStore';

describe('useSceneStore', () => {
  beforeEach(() => {
    // 각 테스트 전 상태 초기화
    useSceneStore.getState().reset();
  });

  it('초기 상태는 섹션이 null이어야 함', () => {
    const { activeSection } = useSceneStore.getState();
    expect(activeSection).toBeNull();
  });

  it('setActiveSection으로 섹션 변경', () => {
    const { setActiveSection } = useSceneStore.getState();

    setActiveSection('about');

    expect(useSceneStore.getState().activeSection).toBe('about');
  });

  it('clearSection으로 섹션 초기화', () => {
    const { setActiveSection, clearSection } = useSceneStore.getState();

    setActiveSection('projects');
    clearSection();

    expect(useSceneStore.getState().activeSection).toBeNull();
  });

  it('isTransitioning 상태 관리', () => {
    const { setIsTransitioning } = useSceneStore.getState();

    expect(useSceneStore.getState().isTransitioning).toBe(false);

    setIsTransitioning(true);
    expect(useSceneStore.getState().isTransitioning).toBe(true);

    setIsTransitioning(false);
    expect(useSceneStore.getState().isTransitioning).toBe(false);
  });
});

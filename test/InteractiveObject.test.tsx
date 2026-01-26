import { describe, it, expect, beforeEach } from 'vitest';
import { useSceneStore } from '~/stores/useSceneStore';

// R3F 컴포넌트는 WebGL 환경이 필요하므로
// 실제 3D 인터랙션은 E2E 테스트(Playwright)로 검증
// 여기서는 store 연동 로직만 테스트

describe('InteractiveObject store integration', () => {
  beforeEach(() => {
    useSceneStore.getState().reset();
  });

  it('setActiveSection으로 섹션 활성화', () => {
    const { setActiveSection } = useSceneStore.getState();

    setActiveSection('about');
    expect(useSceneStore.getState().activeSection).toBe('about');

    setActiveSection('projects');
    expect(useSceneStore.getState().activeSection).toBe('projects');
  });

  it('섹션 변경 시 이전 섹션 덮어쓰기', () => {
    const { setActiveSection } = useSceneStore.getState();

    setActiveSection('about');
    setActiveSection('skills');

    expect(useSceneStore.getState().activeSection).toBe('skills');
  });

  it('clearSection으로 섹션 초기화', () => {
    const { setActiveSection, clearSection } = useSceneStore.getState();

    setActiveSection('contact');
    clearSection();

    expect(useSceneStore.getState().activeSection).toBeNull();
  });
});

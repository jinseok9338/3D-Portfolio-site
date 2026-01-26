import { useEffect } from 'react';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { useSceneStore } from '~/stores/useSceneStore';

const SECTIONS = ['about', 'projects', 'skills', 'contact'] as const;

export function useSectionUrl() {
  const [urlSection, setUrlSection] = useQueryState(
    'section',
    parseAsStringLiteral(SECTIONS).withDefault(null as unknown as typeof SECTIONS[number])
  );

  const activeSection = useSceneStore((state) => state.activeSection);
  const setActiveSection = useSceneStore((state) => state.setActiveSection);

  // URL → Store 동기화 (초기 로드 시)
  useEffect(() => {
    if (urlSection && urlSection !== activeSection) {
      setActiveSection(urlSection);
    }
  }, []);

  // Store → URL 동기화
  useEffect(() => {
    if (activeSection !== urlSection) {
      setUrlSection(activeSection as typeof SECTIONS[number] | null);
    }
  }, [activeSection, urlSection, setUrlSection]);

  return { activeSection, setActiveSection };
}

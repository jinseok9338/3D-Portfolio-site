import { useEffect, useRef } from 'react';
import { useQueryState } from 'nuqs';
import { useSceneStore } from '~/stores/useSceneStore';

export function useSectionUrl() {
  const [urlSection, setUrlSection] = useQueryState('section');
  const activeSection = useSceneStore((state) => state.activeSection);
  const setActiveSection = useSceneStore((state) => state.setActiveSection);

  const initialized = useRef(false);

  // URL → Store (최초 1회만)
  useEffect(() => {
    if (!initialized.current && urlSection) {
      setActiveSection(urlSection as 'about' | 'projects' | 'skills' | 'contact');
      initialized.current = true;
    }
  }, [urlSection, setActiveSection]);

  // Store → URL
  useEffect(() => {
    if (initialized.current || !urlSection) {
      setUrlSection(activeSection);
    }
  }, [activeSection, setUrlSection, urlSection]);

  return { activeSection, setActiveSection };
}

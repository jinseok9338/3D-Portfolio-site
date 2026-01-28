import { useSceneStore } from '~/stores/useSceneStore';
import { AboutSection } from './AboutSection';
import { ProjectsSection } from './ProjectsSection';
import { SkillsSection } from './SkillsSection';
import { ContactSection } from './ContactSection';
import { HobbySection } from './HobbySection';

const SECTION_TITLES: Record<string, string> = {
  about: 'About Me',
  projects: 'Projects',
  skills: 'Skills',
  contact: 'Contact',
  hobby: 'Hobby',
};

export function SectionContent() {
  const activeSection = useSceneStore((state) => state.activeSection);

  if (!activeSection) return null;

  const renderContent = () => {
    switch (activeSection) {
      case 'about':
        return <AboutSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'skills':
        return <SkillsSection />;
      case 'contact':
        return <ContactSection />;
      case 'hobby':
        return <HobbySection />;
      default:
        return <p className="text-muted-foreground">콘텐츠 준비 중...</p>;
    }
  };

  return renderContent();
}

export function getSectionTitle(section: string | null): string {
  if (!section) return '';
  return SECTION_TITLES[section] || section;
}

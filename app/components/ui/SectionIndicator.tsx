import { useSceneStore } from '~/stores/useSceneStore';
import { ROOM_CONFIG } from '~/components/three/roomConfig';
import { motion, AnimatePresence } from 'framer-motion';

// 각 섹션별 설명
const SECTION_DESCRIPTIONS: Record<string, { title: string; subtitle: string }> = {
  Room1: {
    title: 'About',
    subtitle: '저를 소개합니다',
  },
  Room2: {
    title: 'Projects',
    subtitle: '작업물을 확인해보세요',
  },
  Room4: {
    title: 'Skills',
    subtitle: '기술 스택',
  },
  Room5: {
    title: 'Contact',
    subtitle: '연락처',
  },
  Room7: {
    title: 'Hobby',
    subtitle: '취미 생활',
  },
};

/**
 * 현재 선택된 방의 섹션 정보를 왼쪽에 표시
 */
export function SectionIndicator() {
  const activeRoom = useSceneStore((state) => state.activeRoom);

  const sectionInfo = activeRoom ? SECTION_DESCRIPTIONS[activeRoom] : null;

  return (
    <AnimatePresence>
      {sectionInfo && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed left-6 top-1/2 -translate-y-1/2 z-10"
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              {sectionInfo.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {sectionInfo.subtitle}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

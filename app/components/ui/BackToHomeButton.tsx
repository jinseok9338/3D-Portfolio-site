import { useEffect } from 'react';
import { useSceneStore } from '~/stores/useSceneStore';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 홈으로 돌아가는 플로팅 버튼
 * - 방이 선택되었을 때만 표시
 * - 클릭 또는 ESC 키로 초기 상태로 복귀
 */
export function BackToHomeButton() {
  const activeRoom = useSceneStore((state) => state.activeRoom);
  const clearSection = useSceneStore((state) => state.clearSection);

  // ESC 키 바인딩
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeRoom) {
        clearSection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeRoom, clearSection]);

  return (
    <AnimatePresence>
      {activeRoom && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={clearSection}
          className="fixed right-6 bottom-6 z-10 flex items-center gap-2 px-4 py-2 bg-background/90 backdrop-blur-sm border border-border rounded-full shadow-lg hover:bg-muted transition-colors"
        >
          <HomeIcon />
          <span className="text-sm text-foreground">홈으로</span>
          <span className="text-xs text-muted-foreground ml-1">(ESC)</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-foreground"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

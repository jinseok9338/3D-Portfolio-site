import { type ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { useSceneStore } from '~/stores/useSceneStore';

type ContentPanelProps = {
  children: ReactNode;
  title?: string;
  // 오브젝트 모드: true면 ESC로 drawer만 닫음 (방 유지)
  objectMode?: boolean;
};

const panelVariants = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      damping: 25,
      stiffness: 200,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export function ContentPanel({ children, title, objectMode = false }: ContentPanelProps) {
  const activeSection = useSceneStore((state) => state.activeSection);
  const activeObject = useSceneStore((state) => state.activeObject);
  const clearSection = useSceneStore((state) => state.clearSection);
  const closeDrawer = useSceneStore((state) => state.closeDrawer);

  // 패널이 열려있는지 확인 (섹션 모드 또는 오브젝트 모드)
  const isOpen = objectMode ? activeObject !== null : activeSection !== null;

  // 닫기 핸들러 - 모드에 따라 다르게 동작
  const handleClose = () => {
    if (objectMode) {
      closeDrawer(); // drawer만 닫기 (방 유지)
    } else {
      clearSection(); // 섹션 전체 닫기 (홈으로)
    }
  };

  // ESC 키 핸들러
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [isOpen, objectMode]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 패널 */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-background/95 backdrop-blur-md shadow-2xl z-50 overflow-y-auto"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* 헤더 */}
            <div className="sticky top-0 flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold">
                {title || activeSection || ''}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                aria-label="Close panel"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* 콘텐츠 */}
            <div className="p-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

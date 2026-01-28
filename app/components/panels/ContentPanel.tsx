import { type ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { useSceneStore } from '~/stores/useSceneStore';

type ContentPanelProps = {
  children: ReactNode;
  title?: string;
  // 오브젝트 모드: true면 ESC로 drawer만 닫음 (방 유지)
  objectMode?: boolean;
};

// 데스크탑: 오른쪽에서 슬라이드
const sidePanelVariants = {
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

// 모바일: 아래에서 슬라이드
const bottomPanelVariants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      damping: 25,
      stiffness: 200,
    },
  },
  exit: {
    y: '100%',
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

  // 드래그 종료 시 처리 (아래로 충분히 드래그하면 닫힘)
  const handleDragEnd = (_: any, info: PanInfo) => {
    const shouldClose = info.velocity.y > 500 || info.offset.y > 100;
    if (shouldClose) {
      handleClose();
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
          {/* 모바일: 3D 이벤트 차단용 오버레이 - md 미만에서만 */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={(e) => e.stopPropagation()}
          />

          {/* 모바일: Bottom Drawer (70% 높이) - md 미만에서만 표시 */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 h-[70vh] bg-background/95 backdrop-blur-md shadow-2xl z-50 rounded-t-3xl flex flex-col md:hidden"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
          >
            {/* 드래그 핸들 */}
            <div className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none">
              <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-background/80">
              <h2 className="text-lg font-semibold">
                {title || activeSection || ''}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                aria-label="Close panel"
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </div>

            {/* 콘텐츠 - 스크롤 가능 */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4">
              {children}
            </div>
          </motion.div>

          {/* 데스크탑: Side Drawer - md 이상에서만 표시 */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-background/95 backdrop-blur-md shadow-2xl z-50 overflow-y-auto hidden md:block"
            variants={sidePanelVariants}
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

import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { useSceneStore } from '~/stores/useSceneStore';

type ContentPanelProps = {
  children: ReactNode;
  title?: string;
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

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export function ContentPanel({ children, title }: ContentPanelProps) {
  const activeSection = useSceneStore((state) => state.activeSection);
  const clearSection = useSceneStore((state) => state.clearSection);
  const isOpen = activeSection !== null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={clearSection}
          />

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
              <h2 className="text-xl font-semibold capitalize">
                {title || activeSection}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSection}
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

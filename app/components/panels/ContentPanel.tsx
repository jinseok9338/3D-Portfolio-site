import { type ReactNode, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { useSceneStore } from '~/stores/useSceneStore';
import { useIsMobile } from '~/hooks/useIsMobile';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '~/components/ui/drawer';

type ContentPanelProps = {
  children: ReactNode;
  title?: string;
  // 오브젝트 모드: true면 ESC로 drawer만 닫음 (방 유지)
  objectMode?: boolean;
};

export function ContentPanel({ children, title, objectMode = false }: ContentPanelProps) {
  const activeSection = useSceneStore((state) => state.activeSection);
  const activeObject = useSceneStore((state) => state.activeObject);
  const clearSection = useSceneStore((state) => state.clearSection);
  const closeDrawer = useSceneStore((state) => state.closeDrawer);
  const isMobile = useIsMobile();

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

  const handleOpenChange = (open: boolean) => {
    if (!open) {
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
    <Drawer
      open={isOpen}
      onOpenChange={handleOpenChange}
      direction={isMobile ? 'bottom' : 'right'}
    >
      <DrawerContent
        className={
          isMobile
            ? 'h-[70vh] max-h-[70vh]'
            : 'w-full max-w-lg h-full'
        }
      >
        <DrawerHeader className="border-b bg-background/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-lg md:text-xl">
              {title || activeSection || ''}
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close panel"
              >
                {isMobile ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <X className="h-5 w-5" />
                )}
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {/* 콘텐츠 - 스크롤 가능 */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 md:p-6">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

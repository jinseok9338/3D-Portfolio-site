import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand } from 'lucide-react';
import { useSceneStore } from '~/stores/useSceneStore';
import type { RoomId } from '~/types';

// 각 방별 탭 가능한 오브젝트 정보
const ROOM_OBJECTS: Record<string, { label: string; items: string[] }> = {
  Room1: {
    label: 'About',
    items: ['컴퓨터', '책상', '선반', '망원경'],
  },
  Room2: {
    label: 'Projects',
    items: ['노트북', '코르크보드', '책장'],
  },
  Room3: {
    label: 'Easter Egg',
    items: ['TV'],
  },
  Room6: {
    label: 'Gallery',
    items: ['거울', '액자'],
  },
};

export function TouchGuide() {
  const activeRoom = useSceneStore((state) => state.activeRoom);
  const activeObject = useSceneStore((state) => state.activeObject);
  const isTransitioning = useSceneStore((state) => state.isTransitioning);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // 방 변경 시 가이드 표시
  useEffect(() => {
    if (activeRoom && ROOM_OBJECTS[activeRoom] && !isTransitioning) {
      setHasInteracted(false);
      // 약간의 딜레이 후 표시 (카메라 이동 완료 후)
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [activeRoom, isTransitioning]);

  // 오브젝트 선택 시 가이드 숨김
  useEffect(() => {
    if (activeObject) {
      setHasInteracted(true);
      setIsVisible(false);
    }
  }, [activeObject]);

  // 일정 시간 후 자동 숨김
  useEffect(() => {
    if (isVisible && !hasInteracted) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hasInteracted]);

  const roomInfo = activeRoom ? ROOM_OBJECTS[activeRoom] : null;

  if (!roomInfo) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
        >
          <div className="flex items-center gap-3 px-4 py-2.5 bg-background/90 backdrop-blur-md rounded-full border border-border/50 shadow-lg whitespace-nowrap">
            <Hand className="w-4 h-4 text-primary animate-pulse flex-shrink-0" />
            <span className="text-sm text-muted-foreground">탭해서 보기</span>
            <span className="text-sm text-foreground font-medium">
              {roomInfo.items.join(' · ')}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

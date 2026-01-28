import { useEffect, useState, useRef } from 'react';
import { useSceneStore } from '~/stores/useSceneStore';
import { useIsMobile } from '~/hooks/useIsMobile';

/**
 * 이스터에그 모달 - EmulatorJS GBA 게임 (iframe 방식)
 * iframe을 사용해서 EmulatorJS 전역 변수 충돌 방지
 */
export function EasterEggModal() {
  const setActiveModal = useSceneStore((state) => state.setActiveModal);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMobile = useIsMobile();

  const handleClose = () => {
    setActiveModal(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* 헤더 */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-white mb-1">🎮 Goodboy Galaxy</h2>
          <p className="text-white/60 text-sm">이스터에그를 발견하셨네요!</p>
        </div>

        {/* 게임 영역 - iframe */}
        <div className="relative aspect-[3/2] bg-black rounded-lg overflow-hidden border border-white/10">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-green-400">게임 로딩 중...</p>
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src="/emulator.html"
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            allow="autoplay; fullscreen"
          />
        </div>

        {/* 조작 안내 - 데스크탑만 */}
        {!isMobile && (
          <div className="mt-4 text-center">
            <div className="inline-flex gap-6 text-sm text-white/50">
              <span>⬆️⬇️⬅️➡️ 이동</span>
              <span>Z/X 버튼</span>
              <span>Enter 시작</span>
            </div>
          </div>
        )}

        {/* 닫기 안내 */}
        <div className="mt-2 text-center text-sm text-white/30">
          <p>{isMobile ? '바깥 터치로 닫기' : 'ESC 또는 바깥 클릭으로 닫기'}</p>
        </div>
      </div>
    </div>
  );
}

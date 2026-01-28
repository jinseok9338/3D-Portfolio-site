import { useEffect, useRef, useState } from 'react';
import { useSceneStore } from '~/stores/useSceneStore';

/**
 * 이스터에그 모달 - EmulatorJS GBA 게임
 */
export function EasterEggModal() {
  const setActiveModal = useSceneStore((state) => state.setActiveModal);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  const handleClose = () => {
    setActiveModal(null);
  };

  useEffect(() => {
    // ESC 키로 닫기
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // EmulatorJS 초기화
    try {
      // 전역 설정
      (window as any).EJS_player = '#emulator-container';
      (window as any).EJS_gameUrl = '/roms/blastarenaadvance.gba';
      (window as any).EJS_core = 'gba';
      (window as any).EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
      (window as any).EJS_startOnLoaded = true;
      (window as any).EJS_DEBUG_XX = false;
      (window as any).EJS_disableDatabaseRecovery = true;

      // EmulatorJS 스크립트 로드
      const script = document.createElement('script');
      script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
      script.async = true;
      script.onload = () => {
        setIsLoading(false);
      };
      script.onerror = () => {
        setError('에뮬레이터 로드 실패');
        setIsLoading(false);
      };
      document.body.appendChild(script);
      scriptRef.current = script;
    } catch (err) {
      setError('에뮬레이터 초기화 실패');
      setIsLoading(false);
    }

    return () => {
      // 클린업
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
      }
      // EmulatorJS 전역 변수 정리
      delete (window as any).EJS_player;
      delete (window as any).EJS_gameUrl;
      delete (window as any).EJS_core;
      delete (window as any).EJS_pathtodata;
      delete (window as any).EJS_startOnLoaded;
      delete (window as any).EJS_DEBUG_XX;
      delete (window as any).EJS_disableDatabaseRecovery;
      delete (window as any).EJS_emulator;
    };
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
          <h2 className="text-xl font-bold text-white mb-1">🎮 Blast Arena Advance</h2>
          <p className="text-white/60 text-sm">이스터에그를 발견하셨네요!</p>
        </div>

        {/* 게임 영역 */}
        <div className="relative aspect-[3/2] bg-black rounded-lg overflow-hidden border border-white/10">
          {/* EmulatorJS 컨테이너 */}
          <div id="emulator-container" className="w-full h-full" />

          {/* 로딩 상태 */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-green-400">게임 로딩 중...</p>
              </div>
            </div>
          )}

          {/* 에러 상태 */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center">
                <p className="text-red-400 mb-2">⚠️ {error}</p>
                <p className="text-white/50 text-sm">새로고침 후 다시 시도해주세요</p>
              </div>
            </div>
          )}
        </div>

        {/* 조작 안내 */}
        <div className="mt-4 text-center">
          <div className="inline-flex gap-6 text-sm text-white/50">
            <span>⬆️⬇️⬅️➡️ 이동</span>
            <span>Z/X 버튼</span>
            <span>Enter 시작</span>
          </div>
        </div>

        {/* 닫기 안내 */}
        <div className="mt-2 text-center text-sm text-white/30">
          <p>ESC 또는 바깥 클릭으로 닫기</p>
        </div>
      </div>
    </div>
  );
}

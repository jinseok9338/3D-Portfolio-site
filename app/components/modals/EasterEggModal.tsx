import { useEffect, useRef, useState, useCallback } from 'react';
import { useSceneStore } from '~/stores/useSceneStore';
import { useIsMobile } from '~/hooks/useIsMobile';

// 키 코드 매핑
const KEY_MAP = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  a: 'x',       // A 버튼 = X 키
  b: 'z',       // B 버튼 = Z 키
  start: 'Enter',
  select: 'Shift',
};

/**
 * 이스터에그 모달 - EmulatorJS GBA 게임
 */
export function EasterEggModal() {
  const setActiveModal = useSceneStore((state) => state.setActiveModal);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const isMobile = useIsMobile();

  const handleClose = () => {
    setActiveModal(null);
  };

  // 키 입력 시뮬레이션 - EmulatorJS용
  const simulateKey = useCallback((key: string, type: 'down' | 'up') => {
    // keyCode 매핑
    const keyCodeMap: Record<string, number> = {
      'ArrowUp': 38,
      'ArrowDown': 40,
      'ArrowLeft': 37,
      'ArrowRight': 39,
      'x': 88,
      'z': 90,
      'Enter': 13,
      'Shift': 16,
    };

    const keyCode = keyCodeMap[key] || 0;

    // 여러 방식으로 키 이벤트 발생
    const eventInit = {
      key,
      code: key,
      keyCode,
      which: keyCode,
      bubbles: true,
      cancelable: true,
    };

    // 1. document에 디스패치
    document.dispatchEvent(new KeyboardEvent(`key${type}`, eventInit));

    // 2. window에 디스패치
    window.dispatchEvent(new KeyboardEvent(`key${type}`, eventInit));

    // 3. EmulatorJS 컨테이너에 디스패치
    const container = document.getElementById('emulator-container');
    if (container) {
      container.dispatchEvent(new KeyboardEvent(`key${type}`, eventInit));
      // canvas 요소에도 디스패치
      const canvas = container.querySelector('canvas');
      if (canvas) {
        canvas.dispatchEvent(new KeyboardEvent(`key${type}`, eventInit));
      }
    }
  }, []);

  // 터치 이벤트 핸들러
  const handleTouchStart = useCallback((key: keyof typeof KEY_MAP) => {
    simulateKey(KEY_MAP[key], 'down');
  }, [simulateKey]);

  const handleTouchEnd = useCallback((key: keyof typeof KEY_MAP) => {
    simulateKey(KEY_MAP[key], 'up');
  }, [simulateKey]);

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
    // 모바일: EmulatorJS 기본 가상 게임패드 숨기기
    const style = document.createElement('style');
    style.id = 'hide-ejs-gamepad';
    style.textContent = `
      @media (max-width: 768px) {
        #emulator-container [class*="virtualGamepad"],
        #emulator-container [class*="virtual-gamepad"],
        #emulator-container [class*="ejs_virtualGamepad"] {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    // EmulatorJS 초기화
    try {
      // 전역 설정
      (window as any).EJS_player = '#emulator-container';
      (window as any).EJS_gameUrl = '/roms/goodboy-galaxy.gba';
      (window as any).EJS_core = 'gba';
      (window as any).EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
      (window as any).EJS_startOnLoaded = true;
      (window as any).EJS_DEBUG_XX = false;
      (window as any).EJS_disableDatabaseRecovery = true;

      // 모바일: EmulatorJS 기본 가상 게임패드 비활성화 (커스텀 컨트롤러 사용)
      (window as any).EJS_VirtualGamepadSettings = false;

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
      // EmulatorJS 인스턴스 종료
      try {
        const emulator = (window as any).EJS_emulator;
        if (emulator) {
          // 게임 일시정지
          if (typeof emulator.pause === 'function') {
            emulator.pause();
          }
          // 오디오 컨텍스트 종료
          if (emulator.gameManager?.audioContext) {
            emulator.gameManager.audioContext.close();
          }
          // 에뮬레이터 종료
          if (typeof emulator.stop === 'function') {
            emulator.stop();
          }
        }
      } catch (e) {
        console.warn('EmulatorJS cleanup error:', e);
      }

      // 컨테이너 내부 정리
      const container = document.getElementById('emulator-container');
      if (container) {
        container.innerHTML = '';
      }

      // 스크립트 제거
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }

      // EmulatorJS가 생성한 모든 스크립트/스타일 제거
      document.querySelectorAll('script[src*="emulatorjs"], link[href*="emulatorjs"]').forEach(el => {
        el.remove();
      });

      // 주입한 CSS 제거
      document.getElementById('hide-ejs-gamepad')?.remove();

      // EmulatorJS 전역 변수 정리
      delete (window as any).EJS_player;
      delete (window as any).EJS_gameUrl;
      delete (window as any).EJS_core;
      delete (window as any).EJS_pathtodata;
      delete (window as any).EJS_startOnLoaded;
      delete (window as any).EJS_DEBUG_XX;
      delete (window as any).EJS_disableDatabaseRecovery;
      delete (window as any).EJS_VirtualGamepadSettings;
      delete (window as any).EJS_emulator;
      delete (window as any).EJS_GameManager;
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
          <h2 className="text-xl font-bold text-white mb-1">🎮 Goodboy Galaxy</h2>
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

        {/* 모바일: 커스텀 터치 컨트롤러 */}
        {isMobile && (
          <div className="mt-4 flex justify-between items-center px-4">
            {/* D-Pad */}
            <div className="relative w-32 h-32">
              {/* 위 */}
              <button
                className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-white/20 rounded-lg active:bg-white/40 flex items-center justify-center"
                onTouchStart={() => handleTouchStart('up')}
                onTouchEnd={() => handleTouchEnd('up')}
              >
                <span className="text-white text-lg">▲</span>
              </button>
              {/* 아래 */}
              <button
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-white/20 rounded-lg active:bg-white/40 flex items-center justify-center"
                onTouchStart={() => handleTouchStart('down')}
                onTouchEnd={() => handleTouchEnd('down')}
              >
                <span className="text-white text-lg">▼</span>
              </button>
              {/* 왼쪽 */}
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-lg active:bg-white/40 flex items-center justify-center"
                onTouchStart={() => handleTouchStart('left')}
                onTouchEnd={() => handleTouchEnd('left')}
              >
                <span className="text-white text-lg">◀</span>
              </button>
              {/* 오른쪽 */}
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-lg active:bg-white/40 flex items-center justify-center"
                onTouchStart={() => handleTouchStart('right')}
                onTouchEnd={() => handleTouchEnd('right')}
              >
                <span className="text-white text-lg">▶</span>
              </button>
            </div>

            {/* Start/Select */}
            <div className="flex flex-col gap-2">
              <button
                className="px-4 py-2 bg-white/20 rounded-lg active:bg-white/40 text-white text-xs"
                onTouchStart={() => handleTouchStart('select')}
                onTouchEnd={() => handleTouchEnd('select')}
              >
                SELECT
              </button>
              <button
                className="px-4 py-2 bg-white/20 rounded-lg active:bg-white/40 text-white text-xs"
                onTouchStart={() => handleTouchStart('start')}
                onTouchEnd={() => handleTouchEnd('start')}
              >
                START
              </button>
            </div>

            {/* A/B 버튼 */}
            <div className="relative w-28 h-20">
              {/* B 버튼 */}
              <button
                className="absolute left-0 bottom-0 w-12 h-12 bg-red-500/60 rounded-full active:bg-red-500/90 flex items-center justify-center"
                onTouchStart={() => handleTouchStart('b')}
                onTouchEnd={() => handleTouchEnd('b')}
              >
                <span className="text-white font-bold">B</span>
              </button>
              {/* A 버튼 */}
              <button
                className="absolute right-0 top-0 w-12 h-12 bg-green-500/60 rounded-full active:bg-green-500/90 flex items-center justify-center"
                onTouchStart={() => handleTouchStart('a')}
                onTouchEnd={() => handleTouchEnd('a')}
              >
                <span className="text-white font-bold">A</span>
              </button>
            </div>
          </div>
        )}

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

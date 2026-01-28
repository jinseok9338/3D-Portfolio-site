import { useState, useEffect, useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;

// SSR-safe isMobile 체크
function subscribe(callback: () => void) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function getSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function getServerSnapshot() {
  return false; // 서버에서는 기본적으로 false
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// R3F 컴포넌트 외부에서 사용할 수 있는 유틸리티 함수
export function getIsMobile() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
}

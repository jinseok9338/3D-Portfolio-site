import type { RoomConfig, RoomId } from '~/types';

// 방별 설정: 섹션 매핑 + 카메라 위치
// 좌표는 scale=0.003, position=[0,0,0] 적용된 실제 월드 좌표
// 카메라는 방에서 충분히 떨어진 위치 (비스듬히 위에서 바라봄)
export const ROOM_CONFIG: Record<RoomId, RoomConfig> = {
  Room1: {
    section: 'about',
    label: '아이 침실',
    cameraPosition: [1.1, 2.8, -0.1],
    cameraTarget: [-0.02, 1, 1],
  },
  Room2: {
    section: 'projects',
    label: '사무실',
    cameraPosition: [0.8, 1.7, -1.7],
    cameraTarget: [-0.756, 1, -0.35],
  },
  Room3: {
    section: null, // 거실 - 이스터에그 (Phase 7)
    label: '거실',
    // worldCenter: [-0.015, 0.005, -0.014]
    cameraPosition: [0.9, 1.2, -1.5],
    cameraTarget: [-0.015, 0.005, -0.014],
  },
  Room4: {
    section: 'skills',
    label: '주방',
    // worldCenter: [-0.000, 0.005, 0.000]
    cameraPosition: [1.2, 1.2, -1.2],
    cameraTarget: [0, 0.005, 0],
  },
  Room5: {
    section: 'contact',
    label: '침실',
    cameraPosition: [0.8, 1.5, -2],
    cameraTarget: [-1, 0.076, -1],
  },
  Room6: {
    section: null, // 욕실 - 갤러리 (나중에)
    label: '욕실',
    // worldCenter: [-0.015, -0.006, 0.000]
    cameraPosition: [0.9, 0.9, -1.2],
    cameraTarget: [-0.015, -0.006, 0],
  },
  Room7: {
    section: 'hobby',
    label: '헬스장',
    cameraPosition: [1.3, 0.8, -2.5],
    cameraTarget: [-0.34, -0.566, -0.685],
  },
};

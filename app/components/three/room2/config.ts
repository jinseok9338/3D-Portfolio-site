import type { Room2ObjectId, ObjectContent } from '~/types';

// Room2 내부 오브젝트 그룹 정의
// 각 오브젝트 ID에 해당하는 메시 이름들
export const ROOM2_OBJECT_MESHES: Record<Room2ObjectId, string[]> = {
  laptop: [
    'Laptop_Colors_0',
  ],
  corkboard: [
    'Cork_Board1_Colors_0',
    'Cork_Board2_Colors_0',
    'Paper1_Colors_0',
    'Paper2_Colors_0',
    'Paper3_Colors_0',
    'Paper4_Colors_0',
    'Paper5_Colors_0',
    'Paper6_Colors_0',
    'Paper7_Colors_0',
    'Paper8_Colors_0',
    'Picture9_Colors_0',
    'Picture10_Colors_0',
    'Picture11_Colors_0',
    'Picture12_Colors_0',
    'Picture13_Colors_0',
  ],
  bookshelf: [
    'BookShelf_Colors_0',
    'Book1_Colors_0_1',
    'Book2_Colors_0_1',
    'Book3_Colors_0_1',
    'Book4_Colors_0_1',
    'Book14_Colors_0',
    'Book15_Colors_0',
    'Book16_Colors_0',
    'Book17_Colors_0',
    'Book18_Colors_0',
    'Book19_Colors_0',
    'Book20_Colors_0',
    'Book21_Colors_0',
    'Book22_Colors_0',
    'Book23_Colors_0',
    'Book24_Colors_0',
    'Book25_Colors_0',
    'Book26_Colors_0',
    'Book27_Colors_0',
    'Book28_Colors_0',
    'Book29_Colors_0',
    'Book30_Colors_0',
    'Book31_Colors_0',
    'Book32_Colors_0',
    'Book33_Colors_0',
    'Book34_Colors_0',
    'Book35_Colors_0',
    'Book36_Colors_0',
    'Book37_Colors_0',
    'Book38_Colors_0',
    'Book39_Colors_0',
  ],
};

// 모든 클릭 가능한 메시 이름 목록
export const ROOM2_INTERACTIVE_MESHES = new Set(
  Object.values(ROOM2_OBJECT_MESHES).flat()
);

// 메시 이름으로 오브젝트 ID 찾기
export function getMeshObjectId(meshName: string): Room2ObjectId | null {
  for (const [objectId, meshNames] of Object.entries(ROOM2_OBJECT_MESHES)) {
    if (meshNames.includes(meshName)) {
      return objectId as Room2ObjectId;
    }
  }
  return null;
}

// 오브젝트별 콘텐츠
export const ROOM2_CONTENTS: Record<Room2ObjectId, ObjectContent<Room2ObjectId>> = {
  laptop: {
    id: 'laptop',
    title: '주요 프로젝트',
    description: '제가 리드하거나 핵심 역할을 맡은 프로젝트들입니다.',
    projects: [
      {
        name: '미소 원앱 프로젝트',
        description: 'React Native + Module Federation 기반 원앱 전환, 로딩 시간 60% 단축',
        tech: ['React Native', 'Re.Pack', 'Module Federation', 'Hermes'],
      },
      {
        name: '럭셔리 브랜드 내부몰',
        description: 'DIOR, Burberry, Celine 등 LVMH 계열 글로벌 브랜드 플랫폼',
        tech: ['React', 'TanStack Query', 'GKE', 'Helm'],
      },
    ],
  },
  corkboard: {
    id: 'corkboard',
    title: '이전 프로젝트',
    description: '과거에 수행한 프로젝트들입니다.',
    projects: [
      {
        name: '현대건설 하이빌더 TFT',
        description: '약 20억 규모 플랫폼 안정화, 200건+ 이슈 해결',
        tech: ['jQuery', 'Spring Boot', 'MyBatis', 'MSSQL'],
      },
      {
        name: '학원 재원생 관리 시스템',
        description: '출석/납부 관리 시스템 (영어 강사 → 개발자 전환 계기)',
        tech: ['React', 'Express', 'Firebase', 'Cloud Functions'],
      },
    ],
  },
  bookshelf: {
    id: 'bookshelf',
    title: '프로젝트 기술 스택',
    description: '프로젝트에서 사용한 주요 기술들입니다.',
    tags: [
      'React', 'React Native', 'TypeScript', 'Next.js',
      'TanStack Query', 'Module Federation', 'Vite', 'Webpack',
      'GKE', 'Helm', 'Docker', 'PostgreSQL', 'Redis',
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/jinseok9338', icon: 'github' },
    ],
  },
};

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
    subtitle: 'Featured Projects',
    description: '기술 리드 또는 핵심 개발자로 참여한 프로젝트입니다.',
    projects: [
      {
        name: '미소 원앱 프로젝트',
        role: 'Tech Lead & PM',
        period: '2024.04 - 현재',
        description: '4개의 독립된 앱을 하나의 슈퍼앱으로 통합하는 프로젝트. Module Federation을 React Native에 적용하여 코드 공유와 독립 배포를 동시에 달성했습니다.',
        highlights: [
          '앱 로딩 시간 7초 → 2초 (60% 단축)',
          'Re.Pack + Hermes 엔진 최적화',
          '4개 팀 간 코드 공유 아키텍처 설계',
          '주간 릴리즈 자동화 파이프라인 구축',
        ],
        tech: ['React Native', 'Re.Pack', 'Module Federation', 'Hermes', 'TypeScript'],
      },
      {
        name: '럭셔리 브랜드 내부몰',
        role: 'Frontend Lead',
        period: '2024.04 - 현재',
        description: 'DIOR, Burberry, Celine 등 LVMH 계열 글로벌 럭셔리 브랜드의 직원 전용 쇼핑 플랫폼입니다.',
        highlights: [
          '이벤트당 20억원+ 매출 달성',
          'GKE 기반 멀티테넌트 아키텍처 설계',
          'Helm 차트로 브랜드별 독립 배포 환경 구축',
          '5개 글로벌 브랜드 고객사 확보',
        ],
        tech: ['React', 'TanStack Query', 'GKE', 'Helm', 'PostgreSQL', 'Redis'],
      },
    ],
  },
  corkboard: {
    id: 'corkboard',
    title: '이전 프로젝트',
    subtitle: 'Past Projects',
    description: '개발자로서 성장하는 데 중요한 역할을 한 프로젝트들입니다.',
    projects: [
      {
        name: '현대건설 하이빌더 TFT',
        role: 'Frontend Engineer',
        period: '2022.12 - 2023.10',
        description: '약 20억 규모의 건설 프로젝트 관리 플랫폼 안정화 및 기능 개선 프로젝트입니다.',
        highlights: [
          '200건 이상의 레거시 이슈 해결',
          'jQuery → React 점진적 마이그레이션 주도',
          '성능 모니터링 대시보드 구축',
          '코드 리뷰 문화 도입 및 정착',
        ],
        tech: ['React', 'jQuery', 'Spring Boot', 'MyBatis', 'MSSQL'],
      },
      {
        name: '학원 재원생 관리 시스템',
        role: 'Full-stack Developer',
        period: '2018.01 - 2020.04',
        description: '영어 강사로 일하면서 직접 개발한 학원 관리 시스템. 이 프로젝트가 개발자로 전환하는 계기가 되었습니다.',
        highlights: [
          '출석/납부 관리 자동화',
          '행정 업무 50% 절감',
          '학부모 알림 시스템 구축',
          'Firebase 실시간 데이터 동기화',
        ],
        tech: ['React', 'Express', 'Firebase', 'Cloud Functions'],
      },
    ],
  },
  bookshelf: {
    id: 'bookshelf',
    title: '기술 스택',
    subtitle: 'Tech Stack',
    description: '프로젝트에서 사용한 기술들을 카테고리별로 정리했습니다.',
    tagGroups: [
      {
        category: 'Frontend',
        items: ['React', 'React Native', 'Next.js', 'TypeScript', 'TanStack Query', 'Zustand'],
      },
      {
        category: 'Build & Deploy',
        items: ['Vite', 'Webpack', 'Re.Pack', 'Module Federation', 'Docker', 'Helm'],
      },
      {
        category: 'Cloud & Infra',
        items: ['GKE', 'AWS', 'Firebase', 'Cloudflare', 'PostgreSQL', 'Redis'],
      },
      {
        category: 'Tools',
        items: ['Git', 'GitHub Actions', 'Jira', 'Figma', 'Sentry', 'Datadog'],
      },
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/jinseok9338', icon: 'github' },
    ],
  },
};

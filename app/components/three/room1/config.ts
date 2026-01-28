import type { Room1ObjectId, ObjectContent } from '~/types';

// Room1 내부 오브젝트 그룹 정의
// 각 오브젝트 ID에 해당하는 메시 이름들
export const ROOM1_OBJECT_MESHES: Record<Room1ObjectId, string[]> = {
  computer: [
    'Computer_Colors_0',
    'Keyboard_Colors_0',
    'CPU_Colors_0',
    'Mouse_Colors_0',
  ],
  desk: [
    'Top_Colors_0',
    'Drawer_Colors_0',
    'Handle_Colors_0',
    'Leg1_Colors_0',
    'Leg2_Colors_0',
    'Leg3_Colors_0',
  ],
  shelf: [
    'Shelf1_Colors_0',
    'Shelf2_Colors_0',
    'Book_Colors_0',
    'Book1_Colors_0',
    'Book2_Colors_0',
    'Book3_Colors_0',
    'Book4_Colors_0',
    'Book5_Colors_0',
    'Book6_Colors_0',
    'Book7_Colors_0',
    'Book8_Colors_0',
    'Book9_Colors_0',
    'Book10_Colors_0',
    'Book11_Colors_0',
    'Book12_Colors_0',
    'Book13_Colors_0',
  ],
  telescope: [
    'Telescope_Colors_0',
  ],
};

// 모든 클릭 가능한 메시 이름 목록
export const ROOM1_INTERACTIVE_MESHES = new Set(
  Object.values(ROOM1_OBJECT_MESHES).flat()
);

// 메시 이름으로 오브젝트 ID 찾기
export function getMeshObjectId(meshName: string): Room1ObjectId | null {
  for (const [objectId, meshNames] of Object.entries(ROOM1_OBJECT_MESHES)) {
    if (meshNames.includes(meshName)) {
      return objectId as Room1ObjectId;
    }
  }
  return null;
}

// 오브젝트별 콘텐츠
export const ROOM1_CONTENTS: Record<Room1ObjectId, ObjectContent<Room1ObjectId>> = {
  computer: {
    id: 'computer',
    title: '서진석',
    subtitle: 'Frontend Engineer',
    description: '6년차 프론트엔드 개발자. React/TypeScript로 대규모 서비스 만들고 운영해왔고, 복잡한 문제를 깔끔하게 푸는 걸 좋아함.',
    metrics: [
      { label: '경력', value: '6년+', icon: 'briefcase' },
      { label: '프로젝트', value: '10+', icon: 'folder' },
      { label: 'PR 리뷰', value: '500+', icon: 'git-pull-request' },
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/jinseok9338', icon: 'github' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/jinseok9338/', icon: 'linkedin' },
      { label: 'Email', url: 'mailto:jinseok9338@gmail.com', icon: 'mail' },
    ],
  },
  desk: {
    id: 'desk',
    title: '경력',
    subtitle: 'Work Experience',
    items: [
      {
        label: '2024.04 - 현재',
        value: '주식회사 앵커스',
        description: 'Front-end Engineer & PM',
        highlights: [
          'RN Module Federation으로 원앱 구조 설계',
          'GKE 멀티테넌트 플랫폼 셋업',
          'DIOR, Burberry, Celine 등 럭셔리 브랜드 고객사 온보딩',
        ],
      },
      {
        label: '2022.12 - 2023.10',
        value: '주식회사 레이첼블루',
        description: 'Front-end Engineer',
        highlights: [
          '현대건설 하이빌더 TFT 안정화 작업',
          '레거시 이슈 200건+ 처리',
          'jQuery에서 React로 전환 리드',
        ],
      },
      {
        label: '2018.01 - 2020.04',
        value: '(주)서샘영어',
        description: '개발자 / 영어 강사',
        highlights: [
          '학원 관리 시스템 혼자 풀스택으로 개발',
          '출석/결제 자동화해서 행정 업무 반 줄임',
          '영어 강사 하다가 개발에 빠진 계기',
        ],
      },
    ],
  },
  shelf: {
    id: 'shelf',
    title: '자격증 & 학력',
    subtitle: 'Credentials & Education',
    credentials: [
      {
        name: 'AWS Solutions Architect - Associate',
        issuer: 'Amazon Web Services',
        date: '2023',
        icon: 'award',
      },
      {
        name: 'AWS Cloud Practitioner',
        issuer: 'Amazon Web Services',
        date: '2022',
        icon: 'cloud',
      },
      {
        name: 'TOEIC 965',
        issuer: 'ETS',
        date: '2017',
        icon: 'languages',
      },
    ],
    items: [
      {
        label: '2012 - 2015',
        value: 'Portland Community College',
        description: 'Computer Science',
      },
    ],
  },
  telescope: {
    id: 'telescope',
    title: '주요 성과',
    subtitle: 'Key Achievements',
    metrics: [
      { label: '로딩 시간', value: '60%↓', icon: 'zap' },
      { label: '이벤트 매출', value: '20억+', icon: 'trending-up' },
      { label: '이슈 해결', value: '200+', icon: 'check-circle' },
      { label: '글로벌 고객', value: '5+', icon: 'globe' },
    ],
    items: [
      {
        label: '성능 개선',
        value: '로딩 7초 → 2초',
        description: 'Module Federation + Hermes 적용해서 초기 로딩 60% 줄임',
      },
      {
        label: '매출 플랫폼',
        value: '이벤트당 20억+',
        description: 'DIOR, Burberry 내부몰 만들어서 운영 중',
      },
      {
        label: '인프라 설계',
        value: 'GKE 멀티테넌트',
        description: 'Helm 차트로 브랜드별 독립 배포 구성',
      },
    ],
  },
};

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
    title: '안녕하세요!',
    description: '6년차 프론트엔드 개발자 서진석입니다. React/TypeScript 기반의 대규모 서비스 설계부터 운영까지 경험이 있으며, 성능 최적화와 아키텍처 설계에 강점이 있습니다.',
    links: [
      { label: 'GitHub', url: 'https://github.com/jinseok9338', icon: 'github' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/jinseok9338/', icon: 'linkedin' },
      { label: 'Email', url: 'mailto:jinseok9338@gmail.com', icon: 'mail' },
    ],
  },
  desk: {
    id: 'desk',
    title: '경력',
    items: [
      { label: '2024.04 - 현재', value: '주식회사 앵커스 | Front-end Engineer & PM' },
      { label: '2022.12 - 2023.10', value: '주식회사 레이첼블루 | Front-end Engineer' },
      { label: '2018.01 - 2020.04', value: '(주)서샘영어 | 개발자' },
    ],
  },
  shelf: {
    id: 'shelf',
    title: '자격증 & 학력',
    tags: [
      'AWS Solution Architect',
      'AWS Cloud Practitioner',
      'TOEIC 965',
    ],
    description: 'Portland Community College - Computer Science (2012-2015)',
  },
  telescope: {
    id: 'telescope',
    title: '주요 성과',
    description: '앱 로딩 시간 7초 → 2초 (60% 단축) | 이벤트당 20억원+ 매출 플랫폼 구축 | GKE 멀티테넌트 아키텍처 설계 | DIOR, Burberry, Celine 등 글로벌 럭셔리 브랜드 고객사 확보',
  },
};

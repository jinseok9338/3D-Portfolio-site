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

// 오브젝트별 콘텐츠 (나중에 실제 데이터로 교체)
export const ROOM1_CONTENTS: Record<Room1ObjectId, ObjectContent> = {
  computer: {
    id: 'computer',
    title: '안녕하세요!',
    description: '저는 프론트엔드 개발자입니다. 사용자 경험을 중시하며, 인터랙티브한 웹을 만드는 것을 좋아합니다.',
    links: [
      { label: 'GitHub', url: 'https://github.com', icon: 'github' },
      { label: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
      { label: 'Email', url: 'mailto:hello@example.com', icon: 'mail' },
    ],
  },
  desk: {
    id: 'desk',
    title: '경력',
    items: [
      { label: '2024 - 현재', value: '프론트엔드 개발자 @ 스타트업' },
      { label: '2022 - 2024', value: '주니어 개발자 @ 테크 회사' },
      { label: '2018 - 2022', value: '컴퓨터 공학 전공' },
    ],
  },
  shelf: {
    id: 'shelf',
    title: '기술 스택',
    tags: [
      'React', 'TypeScript', 'Next.js', 'Three.js',
      'Tailwind CSS', 'Node.js', 'GraphQL', 'PostgreSQL',
    ],
  },
  telescope: {
    id: 'telescope',
    title: '목표',
    description: '사용자에게 즐거운 경험을 주는 인터랙티브한 웹 애플리케이션을 만들고 싶습니다. 새로운 기술을 배우고 적용하는 것을 즐깁니다.',
  },
};

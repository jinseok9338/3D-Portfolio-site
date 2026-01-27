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

// 오브젝트별 콘텐츠 (나중에 실제 데이터로 교체)
export const ROOM2_CONTENTS: Record<Room2ObjectId, ObjectContent<Room2ObjectId>> = {
  laptop: {
    id: 'laptop',
    title: '프로젝트 목록',
    description: '제가 작업한 주요 프로젝트들입니다.',
    projects: [
      {
        name: 'Portfolio Site',
        description: '3D 인터랙티브 포트폴리오',
        tech: ['React', 'Three.js', 'TypeScript'],
        link: '#',
      },
      {
        name: 'Project 2',
        description: '프로젝트 설명',
        tech: ['React', 'Node.js'],
        link: '#',
      },
    ],
  },
  corkboard: {
    id: 'corkboard',
    title: '진행 중인 작업',
    description: '현재 작업 중이거나 계획 중인 프로젝트들입니다.',
    items: [
      { label: '진행 중', value: 'Portfolio Site 개선' },
      { label: '계획 중', value: '오픈소스 기여' },
      { label: '아이디어', value: '새로운 SaaS 프로젝트' },
    ],
  },
  bookshelf: {
    id: 'bookshelf',
    title: '기술 스택',
    description: '프로젝트에서 사용하는 기술들입니다.',
    tags: [
      'React', 'TypeScript', 'Next.js', 'Three.js',
      'Node.js', 'PostgreSQL', 'Docker', 'AWS',
    ],
  },
};

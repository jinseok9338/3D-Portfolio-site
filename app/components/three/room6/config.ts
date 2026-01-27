import type { Room6ObjectId } from '~/types';

// Room6 내부 오브젝트 그룹 정의
export const ROOM6_OBJECT_MESHES: Record<Room6ObjectId, string[]> = {
  mirror: ['Mirror_Colors_0'],
  pictures: [
    'Picture_Colors_0_2',
    'Picture14_Colors_0',
    'Picture15_Colors_0',
  ],
};

// 모든 클릭 가능한 메시 이름 목록
export const ROOM6_INTERACTIVE_MESHES = new Set(
  Object.values(ROOM6_OBJECT_MESHES).flat()
);

// 메시 이름으로 오브젝트 ID 찾기
export function getMeshObjectId(meshName: string): Room6ObjectId | null {
  for (const [objectId, meshNames] of Object.entries(ROOM6_OBJECT_MESHES)) {
    if (meshNames.includes(meshName)) {
      return objectId as Room6ObjectId;
    }
  }
  return null;
}

// Hover 레이블
export const HOVER_LABELS: Record<Room6ObjectId, string> = {
  mirror: '🖼️ 갤러리',
  pictures: '🖼️ 갤러리',
};

// 갤러리 이미지 (placeholder - 나중에 실제 이미지로 교체)
export const GALLERY_IMAGES = [
  { src: '/images/gallery/1.jpg', title: '작품 1', description: '설명' },
  { src: '/images/gallery/2.jpg', title: '작품 2', description: '설명' },
  { src: '/images/gallery/3.jpg', title: '작품 3', description: '설명' },
];

import type { Room3ObjectId } from '~/types';

// Room3 내부 오브젝트 그룹 정의
export const ROOM3_OBJECT_MESHES: Record<Room3ObjectId, string[]> = {
  tv: ['TV_Colors_0'],
};

// 모든 클릭 가능한 메시 이름 목록
export const ROOM3_INTERACTIVE_MESHES = new Set(
  Object.values(ROOM3_OBJECT_MESHES).flat()
);

// 메시 이름으로 오브젝트 ID 찾기
export function getMeshObjectId(meshName: string): Room3ObjectId | null {
  for (const [objectId, meshNames] of Object.entries(ROOM3_OBJECT_MESHES)) {
    if (meshNames.includes(meshName)) {
      return objectId as Room3ObjectId;
    }
  }
  return null;
}

// Hover 레이블
export const HOVER_LABELS: Record<Room3ObjectId, string> = {
  tv: '🎮 이스터에그',
};

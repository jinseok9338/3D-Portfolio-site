import { useControls, button } from 'leva';
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { useSceneStore } from '~/stores/useSceneStore';
import { ROOM_CONFIG } from './roomConfig';

type RoomValues = {
  camPosX: number;
  camPosY: number;
  camPosZ: number;
  targetX: number;
  targetY: number;
  targetZ: number;
};

/**
 * Leva GUI를 사용한 카메라 디버거
 */
export function CameraDebugger() {
  const setCameraTarget = useSceneStore((state) => state.setCameraTarget);

  // 각 방의 최신 값을 저장할 ref
  const room1Ref = useRef<RoomValues | null>(null);
  const room2Ref = useRef<RoomValues | null>(null);
  const room4Ref = useRef<RoomValues | null>(null);
  const room5Ref = useRef<RoomValues | null>(null);
  const room7Ref = useRef<RoomValues | null>(null);

  // Room1 - About
  const room1 = useControls('Room1 - About (아이침실)', {
    camPosX: { value: ROOM_CONFIG.Room1.cameraPosition[0], min: -5, max: 5, step: 0.1 },
    camPosY: { value: ROOM_CONFIG.Room1.cameraPosition[1], min: 0, max: 5, step: 0.1 },
    camPosZ: { value: ROOM_CONFIG.Room1.cameraPosition[2], min: -5, max: 5, step: 0.1 },
    targetX: { value: ROOM_CONFIG.Room1.cameraTarget[0], min: -1, max: 1, step: 0.01 },
    targetY: { value: ROOM_CONFIG.Room1.cameraTarget[1], min: -1, max: 1, step: 0.01 },
    targetZ: { value: ROOM_CONFIG.Room1.cameraTarget[2], min: -1, max: 1, step: 0.01 },
    'Go': button(() => {
      const v = room1Ref.current;
      if (!v) return;
      setCameraTarget({
        position: [v.camPosX, v.camPosY, v.camPosZ],
        target: [v.targetX, v.targetY, v.targetZ],
      });
    }),
    'Log': button(() => {
      const v = room1Ref.current;
      if (!v) return;
      console.log(`Room1: cameraPosition: [${v.camPosX}, ${v.camPosY}, ${v.camPosZ}], cameraTarget: [${v.targetX}, ${v.targetY}, ${v.targetZ}]`);
    }),
  });
  useEffect(() => { room1Ref.current = room1; }, [room1]);

  // Room2 - Projects
  const room2 = useControls('Room2 - Projects (사무실)', {
    camPosX: { value: ROOM_CONFIG.Room2.cameraPosition[0], min: -5, max: 5, step: 0.1 },
    camPosY: { value: ROOM_CONFIG.Room2.cameraPosition[1], min: 0, max: 5, step: 0.1 },
    camPosZ: { value: ROOM_CONFIG.Room2.cameraPosition[2], min: -5, max: 5, step: 0.1 },
    targetX: { value: ROOM_CONFIG.Room2.cameraTarget[0], min: -1, max: 1, step: 0.01 },
    targetY: { value: ROOM_CONFIG.Room2.cameraTarget[1], min: -1, max: 1, step: 0.01 },
    targetZ: { value: ROOM_CONFIG.Room2.cameraTarget[2], min: -1, max: 1, step: 0.01 },
    'Go': button(() => {
      const v = room2Ref.current;
      if (!v) return;
      setCameraTarget({
        position: [v.camPosX, v.camPosY, v.camPosZ],
        target: [v.targetX, v.targetY, v.targetZ],
      });
    }),
    'Log': button(() => {
      const v = room2Ref.current;
      if (!v) return;
      console.log(`Room2: cameraPosition: [${v.camPosX}, ${v.camPosY}, ${v.camPosZ}], cameraTarget: [${v.targetX}, ${v.targetY}, ${v.targetZ}]`);
    }),
  });
  useEffect(() => { room2Ref.current = room2; }, [room2]);

  // Room4 - Skills
  const room4 = useControls('Room4 - Skills (주방)', {
    camPosX: { value: ROOM_CONFIG.Room4.cameraPosition[0], min: -5, max: 5, step: 0.1 },
    camPosY: { value: ROOM_CONFIG.Room4.cameraPosition[1], min: 0, max: 5, step: 0.1 },
    camPosZ: { value: ROOM_CONFIG.Room4.cameraPosition[2], min: -5, max: 5, step: 0.1 },
    targetX: { value: ROOM_CONFIG.Room4.cameraTarget[0], min: -1, max: 1, step: 0.01 },
    targetY: { value: ROOM_CONFIG.Room4.cameraTarget[1], min: -1, max: 1, step: 0.01 },
    targetZ: { value: ROOM_CONFIG.Room4.cameraTarget[2], min: -1, max: 1, step: 0.01 },
    'Go': button(() => {
      const v = room4Ref.current;
      if (!v) return;
      setCameraTarget({
        position: [v.camPosX, v.camPosY, v.camPosZ],
        target: [v.targetX, v.targetY, v.targetZ],
      });
    }),
    'Log': button(() => {
      const v = room4Ref.current;
      if (!v) return;
      console.log(`Room4: cameraPosition: [${v.camPosX}, ${v.camPosY}, ${v.camPosZ}], cameraTarget: [${v.targetX}, ${v.targetY}, ${v.targetZ}]`);
    }),
  });
  useEffect(() => { room4Ref.current = room4; }, [room4]);

  // Room5 - Contact
  const room5 = useControls('Room5 - Contact (침실)', {
    camPosX: { value: ROOM_CONFIG.Room5.cameraPosition[0], min: -5, max: 5, step: 0.1 },
    camPosY: { value: ROOM_CONFIG.Room5.cameraPosition[1], min: 0, max: 5, step: 0.1 },
    camPosZ: { value: ROOM_CONFIG.Room5.cameraPosition[2], min: -5, max: 5, step: 0.1 },
    targetX: { value: ROOM_CONFIG.Room5.cameraTarget[0], min: -1, max: 1, step: 0.01 },
    targetY: { value: ROOM_CONFIG.Room5.cameraTarget[1], min: -1, max: 1, step: 0.01 },
    targetZ: { value: ROOM_CONFIG.Room5.cameraTarget[2], min: -1, max: 1, step: 0.01 },
    'Go': button(() => {
      const v = room5Ref.current;
      if (!v) return;
      setCameraTarget({
        position: [v.camPosX, v.camPosY, v.camPosZ],
        target: [v.targetX, v.targetY, v.targetZ],
      });
    }),
    'Log': button(() => {
      const v = room5Ref.current;
      if (!v) return;
      console.log(`Room5: cameraPosition: [${v.camPosX}, ${v.camPosY}, ${v.camPosZ}], cameraTarget: [${v.targetX}, ${v.targetY}, ${v.targetZ}]`);
    }),
  });
  useEffect(() => { room5Ref.current = room5; }, [room5]);

  // Room7 - Hobby
  const room7 = useControls('Room7 - Hobby (헬스장)', {
    camPosX: { value: ROOM_CONFIG.Room7.cameraPosition[0], min: -5, max: 5, step: 0.1 },
    camPosY: { value: ROOM_CONFIG.Room7.cameraPosition[1], min: 0, max: 5, step: 0.1 },
    camPosZ: { value: ROOM_CONFIG.Room7.cameraPosition[2], min: -5, max: 5, step: 0.1 },
    targetX: { value: ROOM_CONFIG.Room7.cameraTarget[0], min: -1, max: 1, step: 0.01 },
    targetY: { value: ROOM_CONFIG.Room7.cameraTarget[1], min: -1, max: 1, step: 0.01 },
    targetZ: { value: ROOM_CONFIG.Room7.cameraTarget[2], min: -1, max: 1, step: 0.01 },
    'Go': button(() => {
      const v = room7Ref.current;
      if (!v) return;
      setCameraTarget({
        position: [v.camPosX, v.camPosY, v.camPosZ],
        target: [v.targetX, v.targetY, v.targetZ],
      });
    }),
    'Log': button(() => {
      const v = room7Ref.current;
      if (!v) return;
      console.log(`Room7: cameraPosition: [${v.camPosX}, ${v.camPosY}, ${v.camPosZ}], cameraTarget: [${v.targetX}, ${v.targetY}, ${v.targetZ}]`);
    }),
  });
  useEffect(() => { room7Ref.current = room7; }, [room7]);

  // 유틸리티
  useControls('Actions', {
    'Reset Camera': button(() => setCameraTarget(null)),
    'Export All': button(() => {
      console.log('=== All Room Configs ===');
      const r1 = room1Ref.current;
      const r2 = room2Ref.current;
      const r4 = room4Ref.current;
      const r5 = room5Ref.current;
      const r7 = room7Ref.current;
      if (r1) console.log(`Room1: { cameraPosition: [${r1.camPosX}, ${r1.camPosY}, ${r1.camPosZ}], cameraTarget: [${r1.targetX}, ${r1.targetY}, ${r1.targetZ}] }`);
      if (r2) console.log(`Room2: { cameraPosition: [${r2.camPosX}, ${r2.camPosY}, ${r2.camPosZ}], cameraTarget: [${r2.targetX}, ${r2.targetY}, ${r2.targetZ}] }`);
      if (r4) console.log(`Room4: { cameraPosition: [${r4.camPosX}, ${r4.camPosY}, ${r4.camPosZ}], cameraTarget: [${r4.targetX}, ${r4.targetY}, ${r4.targetZ}] }`);
      if (r5) console.log(`Room5: { cameraPosition: [${r5.camPosX}, ${r5.camPosY}, ${r5.camPosZ}], cameraTarget: [${r5.targetX}, ${r5.targetY}, ${r5.targetZ}] }`);
      if (r7) console.log(`Room7: { cameraPosition: [${r7.camPosX}, ${r7.camPosY}, ${r7.camPosZ}], cameraTarget: [${r7.targetX}, ${r7.targetY}, ${r7.targetZ}] }`);
    }),
  });

  // 현재 카메라 위치 실시간 표시
  const posRef = useRef({ x: 0, y: 0, z: 0 });
  const targetRef = useRef({ x: 0, y: 0, z: 0 });

  useControls('Current Camera', {
    'cam X': { value: 0, disabled: true },
    'cam Y': { value: 0, disabled: true },
    'cam Z': { value: 0, disabled: true },
    'target X': { value: 0, disabled: true },
    'target Y': { value: 0, disabled: true },
    'target Z': { value: 0, disabled: true },
  });

  // 콘솔에 현재 카메라 위치 출력
  useControls('Debug', {
    'Log Current Position': button(() => {
      console.log(`Current Camera: position: [${posRef.current.x}, ${posRef.current.y}, ${posRef.current.z}], target: [${targetRef.current.x}, ${targetRef.current.y}, ${targetRef.current.z}]`);
    }),
  });

  const frameCount = useRef(0);
  useFrame(({ camera, controls }) => {
    frameCount.current++;
    if (frameCount.current % 30 !== 0) return;

    const pos = camera.position;
    const target = (controls as any)?.target;

    posRef.current = {
      x: Math.round(pos.x * 100) / 100,
      y: Math.round(pos.y * 100) / 100,
      z: Math.round(pos.z * 100) / 100,
    };

    if (target) {
      targetRef.current = {
        x: Math.round(target.x * 100) / 100,
        y: Math.round(target.y * 100) / 100,
        z: Math.round(target.z * 100) / 100,
      };
    }
  });

  return null;
}

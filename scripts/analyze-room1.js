// Room1 (아이 침실) 내부 오브젝트 분석 스크립트
// 사용법: node scripts/analyze-room1.js

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { readFileSync } from 'fs';
import { Blob } from 'buffer';

// GLB 파일 읽기
const glbPath = './public/models/low_poly_isometric_rooms.glb';
const buffer = readFileSync(glbPath);

console.log('=== Room1 (아이 침실) 오브젝트 분석 ===\n');

// Three.js는 Node.js에서 직접 실행이 어려우므로,
// 브라우저 콘솔에서 실행할 코드를 출력합니다.

console.log(`
브라우저 개발자 도구 콘솔에서 아래 코드를 실행하세요:

// Scene에서 Room1 찾기
const scene = document.querySelector('canvas').__r3f?.scene;
if (!scene) { console.log('Scene not found'); }

function findRoom1(obj) {
  if (obj.name === 'Room1') return obj;
  for (const child of obj.children) {
    const found = findRoom1(child);
    if (found) return found;
  }
  return null;
}

const room1 = findRoom1(scene);
if (room1) {
  console.log('=== Room1 Children ===');
  function printTree(obj, indent = '') {
    const type = obj.type;
    const hasMesh = obj.isMesh ? ' [MESH]' : '';
    console.log(indent + obj.name + ' (' + type + ')' + hasMesh);
    obj.children.forEach(child => printTree(child, indent + '  '));
  }
  printTree(room1);
} else {
  console.log('Room1 not found');
}
`);

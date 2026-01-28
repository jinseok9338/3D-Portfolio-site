import fs from 'fs';

const buffer = fs.readFileSync('./public/models/low_poly_isometric_rooms.glb');
const chunk0Length = buffer.readUInt32LE(12);
const jsonData = JSON.parse(buffer.toString('utf8', 20, 20 + chunk0Length));

// Scene_1의 children이 Room들
const scene1Node = jsonData.nodes.find(n => n.name === 'Scene_1');
const roomNodeIndices = scene1Node.children;

console.log('=== Room Positions ===\n');

roomNodeIndices.forEach(idx => {
  const roomNode = jsonData.nodes[idx];
  const translation = roomNode.translation || [0, 0, 0];
  const scale = roomNode.scale || [1, 1, 1];

  // 방 내부의 주요 오브젝트들 확인
  const childNames = (roomNode.children || [])
    .map(ci => jsonData.nodes[ci].name)
    .slice(0, 5);

  console.log(`${roomNode.name}:`);
  console.log(`  translation: [${translation.join(', ')}]`);
  console.log(`  scale: [${scale.join(', ')}]`);
  console.log(`  children: ${childNames.join(', ')}...`);
  console.log();
});

// Accessor 정보로 대략적인 위치 파악
console.log('=== Mesh Bounds (first few) ===\n');
const accessors = jsonData.accessors || [];
accessors.slice(0, 5).forEach((acc, i) => {
  if (acc.min && acc.max) {
    console.log(`Accessor ${i}: min=[${acc.min.map(v=>v.toFixed(2)).join(',')}] max=[${acc.max.map(v=>v.toFixed(2)).join(',')}]`);
  }
});

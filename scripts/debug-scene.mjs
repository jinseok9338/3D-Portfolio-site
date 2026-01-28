import fs from 'fs';

const buffer = fs.readFileSync('./public/models/low_poly_isometric_rooms.glb');
const chunk0Length = buffer.readUInt32LE(12);
const jsonData = JSON.parse(buffer.toString('utf8', 20, 20 + chunk0Length));

// Scene에서 시작해서 Room까지의 경로 찾기
const scenes = jsonData.scenes || [];
const nodes = jsonData.nodes;

console.log('=== Scene → Room 경로 ===\n');

function printPath(nodeIdx, depth = 0) {
  const node = nodes[nodeIdx];
  const indent = '  '.repeat(depth);
  console.log(`${indent}[${nodeIdx}] ${node.name}`);

  if (node.name?.startsWith('Room') || depth > 5) {
    return;
  }

  (node.children || []).forEach(childIdx => {
    printPath(childIdx, depth + 1);
  });
}

scenes.forEach((scene, i) => {
  console.log(`Scene ${i}:`);
  scene.nodes.forEach(nodeIdx => printPath(nodeIdx));
});

// Scene_1 찾기
const scene1 = nodes.find(n => n.name === 'Scene_1');
if (scene1) {
  console.log('\n=== Scene_1의 직접 children (Room들) ===');
  scene1.children.forEach(idx => {
    console.log(`  ${nodes[idx].name}`);
  });
}

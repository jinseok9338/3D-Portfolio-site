import fs from 'fs';

const buffer = fs.readFileSync('./public/models/low_poly_isometric_rooms.glb');

const chunk0Length = buffer.readUInt32LE(12);
const jsonData = JSON.parse(buffer.toString('utf8', 20, 20 + chunk0Length));

console.log('=== Nodes ===');
jsonData.nodes.forEach((node, i) => {
  const meshInfo = node.mesh != null ? ` (mesh: ${node.mesh})` : '';
  const childInfo = node.children ? ` children: [${node.children.join(', ')}]` : '';
  console.log(`[${i}] ${node.name || 'unnamed'}${meshInfo}${childInfo}`);
});

console.log('\n=== Scene Root Nodes ===');
const scenes = jsonData.scenes || [];
scenes.forEach((scene, i) => {
  console.log(`Scene ${i}: nodes [${scene.nodes.join(', ')}]`);
});

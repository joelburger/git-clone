const path = require('path');
const { saveFile } = require('../util');
const { statSync, readdirSync } = require('node:fs');
const { saveBlob } = require('./hash-object');
const fs = require('fs');

function constructTreeContents(treeData) {
  let buffer = Buffer.alloc(0);
  treeData.forEach(entry => {
    const folderDetails = Buffer.from(`${entry.mode} ${entry.name}\0`);
    const hashCode = Buffer.from(entry.hashCode, 'hex');
    if (hashCode.length !== 20) {
      throw new Error(`Invalid hashCode length: ${hashCode.length}`);
    }
    const lineBuffer = Buffer.concat([folderDetails, hashCode]);
    buffer = Buffer.concat([buffer, lineBuffer]);
  });
  buffer = Buffer.concat([Buffer.from(`tree ${buffer.length}\0`), buffer]);

  return buffer;
}

function writeTree(directory) {
  const treeData = [];

  readdirSync(directory).forEach(file => {
    if (file === 'node_modules' || file === '.git') {
      return;
    }

    const filePath = path.join(directory, file);
    const stats = statSync(filePath);
    const mode = stats.isDirectory() ? "40000" : stats.mode.toString(8);

    if (stats.isDirectory()) {
      const treeHashCode = writeTree(filePath);
      treeData.push({ type: 'tree', name: file, hashCode: treeHashCode, mode });
    } else {
      const fileItem = { type: 'blob', name: file, mode };
      const buffer = fs.readFileSync(filePath);
      const blobHashCode = saveBlob(buffer.toString('utf8'));
      treeData.push({ ...fileItem, hashCode: blobHashCode });
    }
  });

  return saveFile(constructTreeContents(treeData));
}

module.exports = {
  execute(args) {
    const hashCode = writeTree(process.cwd());

    process.stdout.write(Buffer.from(hashCode));
  },
};
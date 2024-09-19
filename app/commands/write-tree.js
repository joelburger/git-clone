const path = require('path');
const { gitFolders, generateHashCode } = require('../util');
const { statSync, readdirSync } = require('node:fs');
const { saveBlob } = require('./hash-object');
const fs = require('fs');

function constructTreeContents(treeData) {
  treeData.forEach(entry = {
    // complete me
  })
}


function writeTree(directory) {
  const treeData = [];

  readdirSync(directory).forEach(file => {
    if (file === 'node_modules' || file === '.git') {
      return;
    }

    const filePath = path.join(directory, file);
    const stats = statSync(filePath);
    const mode = stats.mode.toString(8).slice(-3);
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

  return generateHashCode(JSON.stringify(treeData));
}


module.exports = {
  execute(args) {
    const hashCode = writeTree(process.cwd());

    process.stdout.write(Buffer.from(hashCode).toString('hex'));
  },
};
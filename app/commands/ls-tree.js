const { readFile } = require('../util');
const { inflateSync } = require('node:zlib');

function fetchTree(hashCode) {
  const data = readFile(hashCode);
  const buffer = inflateSync(data);
  const headerEnd = buffer.indexOf('\0') + 1;
  const folders = [];
  let cursor = headerEnd;

  while (cursor < buffer.length) {
    const metadataEnd = buffer.indexOf('\0', cursor);
    const [mode, name] = buffer.subarray(cursor, metadataEnd).toString('utf8').split(' ');
    folders.push({ mode, name });
    cursor = metadataEnd + 1 + 20; // skip metadata and hashcode
  }

  return folders;
}

module.exports = {
  execute(args) {
    const [, hashCode] = args;

    const folders = fetchTree(hashCode);

    const result = folders.map(folder => folder.name).join('\n');

    process.stdout.write(result + '\n');
  },
};
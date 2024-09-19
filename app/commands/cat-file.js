const { readFile } = require('../util');
const { inflateSync } = require('node:zlib');

function fetchBlob(hashCode) {
  const data = readFile(hashCode);
  const buffer = inflateSync(data);
  const headerEnd = buffer.indexOf('\0') + 1;
  const header = buffer.subarray(0, headerEnd).toString('utf8');
  const content = buffer.subarray(headerEnd).toString('utf8');

  return {
    header,
    content,
  };
}

module.exports = {
  execute(args) {
    const [, hashCode] = args;

    const { content } = fetchBlob(hashCode);

    process.stdout.write(content);
  },
};
const fs = require('fs');
const { deflateSync } = require('node:zlib');
const { join } = require('node:path');
const { gitFolders, parseHashCode, generateHashCode } = require('../util');


module.exports = {
  saveBlob(content) {
    const objectData = `blob ${content.length}\0${content}`;
    const hashCode = generateHashCode(objectData, 'hex');
    const { folder, objectName } = parseHashCode(hashCode);
    const objectFilePath = join(gitFolders.objects, folder);

    fs.mkdirSync(objectFilePath, { recursive: true });

    const compressedData = deflateSync(objectData);

    fs.writeFileSync(join(objectFilePath, objectName), compressedData);

    return hashCode;
  },

  execute(args) {
    const [, objectPath] = args;

    if (!fs.existsSync(objectPath)) {
      throw new Error(`Object file not found: ${objectPath}`);
    }

    const data = fs.readFileSync(objectPath);

    const hashCode = this.saveBlob(data.toString('utf8'));

    process.stdout.write(hashCode);
  },
};
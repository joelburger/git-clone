const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { createHash } = require('crypto');
const { parseHashCode, gitFolders, generateHashCode } = require('../helpers/common');


module.exports = {
  execute(args) {
    const [, objectPath] = args;

    if (!fs.existsSync(objectPath)) {
      throw new Error(`Object file not found: ${objectPath}`);
    }

    const data = fs.readFileSync(objectPath);
    const fileContents = `blob ${data.length}\0${data}`;
    const hashCode = generateHashCode(fileContents);
    const { folder, objectName } = parseHashCode(hashCode);
    const compressedFileContents = zlib.deflateSync(fileContents);
    const objectFilePath = path.join(gitFolders.objects, folder);

    fs.mkdirSync(objectFilePath);
    fs.writeFileSync(path.join(objectFilePath, objectName), compressedFileContents);

    process.stdout.write(hashCode);
  },
};
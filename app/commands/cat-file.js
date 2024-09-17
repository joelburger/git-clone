const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { parseHashCode, gitFolders } = require('../helpers/common');

module.exports = {
  execute(args) {
    const [, hashCode] = args;

    const { folder, objectName } = parseHashCode(hashCode);
    const objectPath = path.join(gitFolders.objects, folder, objectName);

    if (!fs.existsSync(objectPath)) {
      throw new Error(`Object file not found: ${objectPath}`);
    }

    const data = fs.readFileSync(path.join(gitFolders.objects, folder, objectName));
    const dataUnzipped = zlib.inflateSync(data);
    const content = dataUnzipped.toString().split('\0')[1];

    process.stdout.write(content);
  },
};
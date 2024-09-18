const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { createHash } = require('crypto');
const { parseHashCode, gitFolders, generateHashCode, saveObject } = require('../helpers/common');


module.exports = {
  execute(args) {
    const [, objectPath] = args;

    if (!fs.existsSync(objectPath)) {
      throw new Error(`Object file not found: ${objectPath}`);
    }

    const data = fs.readFileSync(objectPath);

    const hashCode = saveObject(data);

    process.stdout.write(hashCode);
  },
};
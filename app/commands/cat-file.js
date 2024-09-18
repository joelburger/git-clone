const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { parseHashCode, gitFolders, fetchObject, fetchBlob } = require('../helpers/common');

module.exports = {
  execute(args) {
    const [, hashCode] = args;

    const { content } = fetchBlob(hashCode);

    process.stdout.write(content);
  },
};
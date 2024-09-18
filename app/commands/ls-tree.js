const fs = require('fs');
const { gitFolders, fetchObject, fetchTree } = require('../helpers/common');
const path = require('path');

function parseTreeEntry(entry) {
  const [descriptor, hashCode] = entry.split('\0');
  const [mode, name] = descriptor.split(' ');

  return { mode, name, hashCode };
}

module.exports = {
  execute(args) {
    const [, hashCode] = args;
    const folders = fetchTree(hashCode);

    const result = folders.map(folder => folder.name).join('\n');

    process.stdout.write(result + '\n');
  },
};
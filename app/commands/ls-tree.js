require('fs');
const { fetchTree } = require('../helpers/common');

module.exports = {
  execute(args) {
    const [, hashCode] = args;

    const folders = fetchTree(hashCode);

    const result = folders.map(folder => folder.name).join('\n');

    process.stdout.write(result + '\n');
  },
};
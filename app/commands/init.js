const fs = require('fs');
const path = require('path');
const { gitFolders } = require('../util');

module.exports = {
  execute(args) {
    fs.mkdirSync(gitFolders.root, { recursive: true });
    fs.mkdirSync(gitFolders.objects, { recursive: true });
    fs.mkdirSync(gitFolders.refs, { recursive: true });
    fs.writeFileSync(path.join(gitFolders.root, 'HEAD'), 'ref: refs/heads/main\n');

    console.log('Initialised git directory');
  },
};
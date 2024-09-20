const fs = require('fs');
const { saveFile } = require('../util');


module.exports = {
  saveBlob(content) {
    const data = `blob ${content.length}\0${content}`;

    return saveFile(data);
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
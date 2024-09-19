const fs = require('fs');
const { saveObject } = require('../helpers/common');

module.exports = {
  execute(args) {
    const [, objectPath] = args;

    if (!fs.existsSync(objectPath)) {
      throw new Error(`Object file not found: ${objectPath}`);
    }

    const data = fs.readFileSync(objectPath);

    const hashCode = saveObject(data.toString('utf8'));

    process.stdout.write(hashCode);
  },
};
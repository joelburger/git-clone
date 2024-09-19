const { fetchBlob } = require('../helpers/common');

module.exports = {
  execute(args) {
    const [, hashCode] = args;

    const { content } = fetchBlob(hashCode);

    process.stdout.write(content);
  },
};
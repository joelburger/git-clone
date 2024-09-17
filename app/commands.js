const catFile = require('./commands/cat-file');
const hashObject = require('./commands/hash-object');
const init = require('./commands/init');

module.exports = {
  'cat-file': catFile,
  'init': init,
  'hash-object': hashObject,
};
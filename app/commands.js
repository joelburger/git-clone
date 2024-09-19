const catFile = require('./commands/cat-file');
const hashObject = require('./commands/hash-object');
const init = require('./commands/init');
const lsTree = require('./commands/ls-tree');
const writeTree = require('./commands/write-tree');

module.exports = {
  'cat-file': catFile,
  'init': init,
  'hash-object': hashObject,
  'ls-tree': lsTree,
  'write-tree': writeTree,
};
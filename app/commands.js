const catFile = require('./commands/cat-file');
const commitTree = require('./commands/commit-tree');
const hashObject = require('./commands/hash-object');
const init = require('./commands/init');
const lsTree = require('./commands/ls-tree');
const writeTree = require('./commands/write-tree');

module.exports = {
  'cat-file': catFile,
  'commit-tree': commitTree,
  'hash-object': hashObject,
  'init': init,
  'ls-tree': lsTree,
  'write-tree': writeTree,
};
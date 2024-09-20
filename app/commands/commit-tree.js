const { saveFile } = require('../util');
const PARAMETER_PARENT_OBJECT = '-p';
const PARAMETER_COMMIT_MESSAGE = '-m';

const AUTHOR_DETAILS = `author Joel <joel@burgerjoe.dev> 0 +0000\ncommitter Joel <joel@burgerjoe.dev> 0 +0000`;

function parseParameters(parameters) {
  const map = new Map();
  for (let i = 0; i < parameters.length; i += 2) {
    map.set(parameters[i], parameters[i + 1]);
  }
  return map;
}

function saveCommit(content) {
  const data = `commit ${content.length}\0${content}`;

  return saveFile(data);
}

module.exports = {
  execute(args) {
    const [treeHashCode, ...parameters] = args;
    const parameterMap = parseParameters(parameters);

    let content = `tree ${treeHashCode}\n`;
    if (parameterMap.has(PARAMETER_PARENT_OBJECT)) {
      content += `parent ${parameterMap.get(PARAMETER_PARENT_OBJECT)}\n`;
    }
    content += `${AUTHOR_DETAILS}\n\n${parameterMap.get(PARAMETER_COMMIT_MESSAGE)}\n`;

    const hashCode = saveCommit(content);

    process.stdout.write(hashCode);
  },
};
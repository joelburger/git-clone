const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const [, , command, ...args] = process.argv;

switch (command) {
  case 'init':
    createGitDirectory();
    break;
  case 'cat-file':
    readFile(args);
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}

function readFile(args) {
  const [, hash] = args;

  const folder = hash.slice(0,2);
  const objectName = hash.slice(2);

  const content = fs.readFileSync(path.join(process.cwd(), '.git', 'objects', folder, objectName));
  const dataUnzipped = zlib.inflateSync(content);
  const res = dataUnzipped.toString().split('\0')[1];
  process.stdout.write(res);
}

function createGitDirectory() {
  fs.mkdirSync(path.join(process.cwd(), '.git'), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), '.git', 'objects'), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), '.git', 'refs'), { recursive: true });

  fs.writeFileSync(path.join(process.cwd(), '.git', 'HEAD'), 'ref: refs/heads/main\n');
  console.log('Initialized git directory');
}

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { createHash } = require('crypto');

function generateHashCode(data) {
  return createHash('sha1').update(data).digest('hex');
}

module.exports = {
  execute(args) {
    const [, filePath] = args;
    const data = fs.readFileSync(filePath);
    const fileContents = `blob ${data.length}\0${data}`;
    const compressedFileContents = zlib.deflateSync(fileContents);

    // Create a 40 character hash code based on the file contents
    const hashCode = generateHashCode(fileContents);

    // Derive folder and object name based on hash code
    const folder = hashCode.slice(0, 2);
    const objectName = hashCode.slice(2);

    // Write file to objects folder
    const objectFilePath = path.join(process.cwd(), '.git', 'objects', folder);
    fs.mkdirSync(objectFilePath);
    fs.writeFileSync(path.join(objectFilePath, objectName), compressedFileContents);

    // Write hash code to stdout
    process.stdout.write(hashCode);
  },
};
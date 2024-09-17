const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

module.exports = {
    execute(args) {
        const [, hash] = args;
        const folder = hash.slice(0,2);
        const objectName = hash.slice(2);
        const data = fs.readFileSync(path.join(process.cwd(), '.git', 'objects', folder, objectName));
        const dataUnzipped = zlib.inflateSync(data);
        const content = dataUnzipped.toString().split('\0')[1];

        process.stdout.write(content);
    }
}
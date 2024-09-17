const fs = require('fs');
const path = require('path');

module.exports = {
    execute(args) {
        fs.mkdirSync(path.join(process.cwd(), '.git'), {recursive: true});
        fs.mkdirSync(path.join(process.cwd(), '.git', 'objects'), {recursive: true});
        fs.mkdirSync(path.join(process.cwd(), '.git', 'refs'), {recursive: true});
        fs.writeFileSync(path.join(process.cwd(), '.git', 'HEAD'), 'ref: refs/heads/main\n');

        console.log('Initialised git directory');
    }
}
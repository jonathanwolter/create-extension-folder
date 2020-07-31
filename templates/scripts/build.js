const path = require('path');
const fs = require('fs');

const tar = require('tar');

const root = process.cwd();
const package = require(path.join(root, 'package.json'));

const bundle = () => new Promise((resolve, reject) => {
    console.log("building package...");
    await execSync('tsc -p .');
    tar.c(
        {
          gzip: true,
          file: `${path.basename(root)}.tar.gz`
        },
        ['README.md', 'icon.png', 'package.json', 'package-lock.json', 'build']
      )
});

(async () => {
    createFiles();
    await bundle();
    console.log('Done!');
})();

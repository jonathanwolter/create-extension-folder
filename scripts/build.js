const path = require('path');
const fs = require('fs');

const archiver = require('archiver');

const root = process.cwd();
const package = require(path.join(root, 'package.json'));

const bundle = () => new Promise((resolve, reject) => {
    console.log("building package...")
    await execSync('npm run-script build');
    const output = fs.createWriteStream(`${package.name}.tar.gz`);
    const archive = archiver('tar.gz');

    output.on('close', () => {
        resolve();
    });

    archive.on('error', () => {
        console.log('error while creating package :/');
        reject();
    });

    archive.pipe(output);

    archive.file('package.json');
    archive.file('package-lock.json');
    
    archive.file('icon.png');

    archive.directory(path.dirname(package.main));

    archive.finalize();
});

(async () => {
    createFiles();
    await bundle();
    console.log('Done!');
})();

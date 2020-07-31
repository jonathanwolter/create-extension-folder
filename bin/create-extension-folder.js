#!/usr/bin/env node
const path = require('path');

const [, , ...args] = process.argv;

const command = args[0];

switch (command) {

    case 'init':
        require('../scripts/init');
        break;const path = require('path');
        const fs = require('fs');
        const util = require('util');
        const { execSync } = require('child_process');
        const copyfiles = util.promisify(require('copyfiles'));
        
        const templateFolder = path.join(__dirname, '../templates');
        const projectFolder = process.cwd();
        const packageFile = path.join(projectFolder, 'package.json');
        const folderName = path.basename(projectFolder);
        const args = process.argv
        
        let validArgs = true;
        let customFolder = false;
        
        if (args.length = 1) {
            projectName = args[0];
            customFolder = true;
            validArgs = true;
        } else if (args.length > 1) {
            console.log("Too many arguments! exiting...")
            validArgs = false;
        } else if (args.length < 1) {
            projectName = folderName;
            validArgs = true;
            customFolder = false;
        }
        
        if(customFolder){
            process.mkdir(projectName)
            process.chdir(projectName)
        }
        
        if (validArgs) {
            (async () => {
                console.log('copying boilerplate project files...');
                process.chdir(templateFolder);
                await copyfiles([`**/*`, projectFolder], {
                    all: true,
                    soft: true
                });
                process.chdir(projectFolder);
                console.log('project files were copied!');
        
                console.log('applying project name...');
                const package = require(packageFile);
                package.name = projectName;
                fs.writeFileSync(packageFile, JSON.stringify(package, null, 2));
                console.log('project name applied!')
        
                console.log('installing dependencies...');
                await execSync('npm i');
                console.log('dependencies successfully installed!')
        
        
                console.log('done!');
                console.log('run "npm run build" to build your custom module.');
            })();
        }
}
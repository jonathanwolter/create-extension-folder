module.exports = {
    main: function main(args) {
        const path = require('path');
        const fs = require('fs');
        const util = require('util');
        const { execSync } = require('child_process');
        const copyfiles = util.promisify(require('copyfiles'));

        const templateFolder = path.join(__dirname, '../templates');
        let projectFolder = process.cwd();
        let projectName = "";

        let validArgs = true;
        let customFolder = false;

        args.shift()
        console.log(args.length);

        if (args.length == 1) {
            projectName = args[0];
            customFolder = true;
            validArgs = true;
        } else if (args.length > 1) {
            console.log("Too many arguments! exiting...")
            validArgs = false;
        }

        if (customFolder) {
            fs.mkdir(path.join(projectFolder, projectName), { recursive: false }, (err) => { console.log("error creating folder" + err) });
            projectFolder = path.join(projectFolder, projectName);
            console.log("created project folder");
        }
        
        const packageFile = path.join(projectFolder, 'package.json');
        const folderName = path.basename(projectFolder);
        projectName = folderName;

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
}
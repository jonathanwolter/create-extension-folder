const path = require('path');
const fs = require('fs');
const util = require('util');
const { execSync } = require('child_process');
const ora = require('ora');

//simple recursive copy function
let copyRecursiveSync = function (source, destination) {
    let exists = fs.existsSync(source); //does the source exists?
    let status = exists && fs.statSync(source); 
    let Directory = exists && status.isDirectory(); //is the source a directory?
    if (Directory) { //if the source is a directory, recursively use this function to seperately copy each sub-file
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination);
        }
        fs.readdirSync(source).forEach(function (child) {
            copyRecursiveSync(path.join(source, child),
                path.join(destination, child));
        });
    } else { //if the source is not a directory, copy it to the destination
        fs.copyFileSync(source, destination);
    }
};

module.exports = {
    main: function main(template, projectName) {
        //whether a seperate folder for the project should be created
        let customFolder = false;
        if (projectName != "") { customFolder = true };

        //projectType = template type
        const projectType = template;

        //assign project properties and package dependencies
        let templateFolder = path.join();
        let scriptsFolder = path.join(__dirname, '../templates/scripts');

        //the folder where the user started the script
        let projectFolder = process.cwd();
        
        //set the template folder according to the template type
        if (template == "example") {
            templateFolder = path.join(__dirname, '../templates/example');
        } else if (template == "empty") {
            templateFolder = path.join(__dirname, '../templates/empty');
        } else if (template == "basic"){
            templateFolder = path.join(__dirname, '../templates/basic');
        }

        (async () => {
            //the loading animation
            let loading = ora('creating folder').start();
            loading.color = 'yellow';
            loading.spinner = {
                interval: 80,
                frames: ['-', '\\', '|', '/']
            };

            //create a custom folder for the project
            if (customFolder) {
                if (!fs.existsSync(path.join(projectFolder, projectName))) {
                    fs.mkdirSync(path.join(projectFolder, projectName), { recursive: false }, (err) => { console.log(`error creating folder ${projectName}: ` + err) });
                }
                projectFolder = path.join(projectFolder, projectName);
                process.chdir(projectFolder);
            }

            loading.succeed('created folder');

            //set the paths accordin to the custom folder or non-custom folder
            const packageFile = path.join(projectFolder, 'package.json');
            const folderName = path.basename(projectFolder);
            projectName = folderName;

            //copy the template to the project folder
            loading = ora(`copying boilerplate project from "${templateFolder}" to "${projectFolder}" ...`).start();
            copyRecursiveSync(templateFolder, projectFolder);
            copyRecursiveSync(scriptsFolder, path.join(projectFolder+"/scripts"));
            copyRecursiveSync(path.join(__dirname, '../templates/deploy.json'), path.join(projectFolder, '/deploy.json'));
            loading.succeed('copied folders');

            //change the name package.json
            loading = ora('applying project name...').start();
            const package = require(packageFile);
            package.name = projectName;
            fs.writeFileSync(packageFile, JSON.stringify(package, null, 2));
            loading.succeed('project name applied');

            //download dependencies
            execSync('npm i');

            console.log('done!');
            console.log('run "npm run build" to build your custom module.');
        })();
    }
}
#!/usr/bin/env node
const path = require('path');
const init = require('./init');
//loading animation
const ora = require('ora');
let args = require('minimist')(process.argv.slice(2));

//the supported template types and options
const template_types = ["example", "basic", "empty"];
const supported_options = ["template", "_", ]

//the error message that is built of all the validation-problems of the arguments
let error = "";

//project template
const template = "basic";
//whether the arguments are valid
let validArgs = true;

//self-explaining
let isObject = function isObject(obj) {
    return obj === Object(obj);
}

//checks if all arguments are valid are of type RegExp: "^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$!"
let isValidRegEx = function isValid(arg) {
    if (isObject(arg)) {
        for (let i = 0; Object.keys(arg).length > i; i++) {
            const key = Object.keys(arg)[i];
            isValidRegEx(arg[key]);
        }
    } else if (Array.isArray(arg)) {
        arg.forEach(element => isValidRegEx(element));
    } else {
        const validchars = new RegExp('^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$');
        if (!validchars.test(arg)) {
            validArgs = false;
            error += "Values not type of ^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$!";
        }
    }

}

//loading animation
let loading = ora('validating arguments ' + JSON.stringify(args)).start();
loading.color = 'yellow';
loading.spinner = {
    interval: 80,
    frames: ['-', '\\', '|', '/']
};

isValidRegEx(args);

//if more than one template type is given:
if (isObject(args.template)) {
    validArgs = false;
    error += "Invalid `template` options! ";
}
//if only one template is given, check if template is supported
else if (args.template != undefined && !template_types.includes(args.template)){
    error += args.template + "is not a valid template! ";
    validArgs = false;
}
//seems like the template is valid, if the code got here
else {
    try {
        let unknownoptions;
        //check if more options than template and porject name are given, if so, validArgs = false 
        for(let i = 0; Object.keys(args).length > i; i++){
            unknownoptions = !supported_options.includes(Object.keys(args)[i]);
            if(unknownoptions){break;}
        }
        if (unknownoptions) {
            error += "Unkown option(s)!"
            validArgs = false;
        } else {
            template = args.template
        }
    } catch{
        //if no template given, leave template = "basic"
        console.log("No template given. Conitnuing with basic project template.");
    }
}
//whether more than one non-option argument is given => validArgs = false
if (args._.length > 1) {
    error += "Too many arguments that are no options! "
    validArgs = false;
}

//if all arguments are valid, continue with scripts
if (validArgs) {
    loading.succeed(`Validated arguments. Creating Project with template ${template} and name ${args._[0]}`);
    init.main(template, args._[0]);
} else {
    loading.fail(error);
}
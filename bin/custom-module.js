#!/usr/bin/env node
const path = require('path');

const [, , ...args] = process.argv;

const command = args[0];

switch (command) {
    /*case 'build':
        require('../scripts/build');
        break;

    case 'deploy':
        require('../scripts/deploy');*/

    case 'init':
        require('../scripts/init');
        break;
    
    case 'test':
        require('../scripts/test');
        break;
}
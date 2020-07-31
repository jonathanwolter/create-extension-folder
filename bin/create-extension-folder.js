#!/usr/bin/env node
const path = require('path');

const [, , ...args] = process.argv;

const command = args[0];

let init = require('../scripts/init');
init.main(args);
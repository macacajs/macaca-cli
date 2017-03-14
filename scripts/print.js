#!/usr/bin/env node

'use strict';

var chalk = require('chalk');
var EOL = require('os').EOL;
var logo = require('macaca-logo');

var pkg = require('../package');

console.log('');
logo.print();
console.log(`${chalk.white('Macaca was successfully installed! Please visit: ')}${chalk.cyan(pkg.homepage)}${EOL}`);

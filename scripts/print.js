#!/usr/bin/env node

'use strict';

var EOL = require('os').EOL;
var logo = require('macaca-logo');

var pkg = require('../package');
var _ = require('../lib/common/helper');

var chalk = _.chalk;

console.log('');
logo.print();
console.log(`${chalk.white('Macaca was successfully installed! Please visit: ')}${chalk.cyan(pkg.homepage)}${EOL}`);

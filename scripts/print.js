#!/usr/bin/env node

'use strict';

var chalk = require('chalk');
var EOL = require('os').EOL;
var logo = require('macaca-logo');

console.log('');
logo.print();
console.log(chalk.white('Macaca was successfully installed!' + EOL));
console.log('Run `%s` for further help.' + EOL, chalk.cyan('macaca -h'));

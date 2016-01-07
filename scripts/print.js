#!/usr/bin/env node
/* ================================================================
 * macaca-client by xdf(xudafeng[at]126.com)
 *
 * first created at : Tue Mar 17 2015 00:16:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright 2013 xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

var chalk = require('chalk');
var EOL = require('os').EOL;
var logo = require('macaca-logo');

console.log('');
logo.print();
console.log(chalk.white('Macaca was successfully installed!' + EOL));
console.log('Run `%s` for further help.' + EOL, chalk.cyan('macaca -h'));

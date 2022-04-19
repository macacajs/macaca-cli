#!/usr/bin/env node

'use strict';

var program = require('commander');
var Coverage = require('macaca-coverage');

var _ = require('../lib/common/helper');

var options = {
  verbose: false
};

program
  .option('-r, --runtime <s>', 'set the type of runtime(web, java, ios)')
  .option('-f, --file <s>', 'coverage file to read(java<*.exec>, web)')
  .option('-s, --source <s>', 'location of the source files(java only)')
  .option('-c, --classfiles <s>', 'location of Java class files(java only)')
  .option('-p, --project <s>', 'location of Xcode project(ios only)')
  .option('-n, --name <s>', 'name of Xcode project\'s scheme(ios only)')
  .option('--html <s>', 'generate HTML report')
  .option('--json <s>', 'generate JSON report')
  .option('--xml <s>', 'generate XML report(java, ios)')
  .option('--verbose', 'show more debugging information')
  .parse(process.argv);

_.merge(options, _.getConfig(program));

Coverage(options);

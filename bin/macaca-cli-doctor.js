#!/usr/bin/env node

'use strict';

var co = require('co');
var program = require('commander');

var Doctor = require('../lib/doctor');
var _ = require('../lib/common/helper');

var options = {
  verbose: false
};

program
  .option('--verbose', 'show more debugging information')
  .parse(process.argv);

_.merge(options, _.getConfig(program));

var doctor = new Doctor(options);

co(doctor.check);

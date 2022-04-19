#!/usr/bin/env node

'use strict';

var co = require('co');
var program = require('commander');

var server = require('../lib').server;
var _ = require('../lib/common/helper');
var options = require('../lib/common/config').server;

program
  .option('-p, --port <d>', 'set port for server (default: ' + options.port + ')')
  .option('--verbose', 'show more debugging information')
  .parse(process.argv);

co(server, _.getConfig(program));

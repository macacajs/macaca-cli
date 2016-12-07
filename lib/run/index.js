'use strict';

const co = require('co');
const fs = require('fs');
const path = require('path');
const util = require('util');
const EventEmitter = require('events');
const childProcess = require('child_process');

const _ = require('../common/helper');

const defaultOpt = {
  cwd: process.cwd(),
  directory: 'macaca-test'
};

const server = require('../server');

function Runner() {
  EventEmitter.call(this);
  this.isRunning = false;
}

util.inherits(Runner, EventEmitter);

Runner.prototype.init = function(options) {
  this.options = options;
  if (!this.isRunning) {
    this.startServer();
  } else {
    this.initFramework();
  }
};

Runner.prototype.startServer = function() {
  co(server, {
    port: this.options.port,
    window: this.options.window
  }).then(() => {
    this.isRunning = true;
    this.initFramework();
  }).catch((err) => {
    process.nextTick(() => {
      throw err;
    });
  });
};

Runner.prototype.initFramework = function() {
  const options = this.options;

  // lookup framework from local node_modules
  const frameworkBin = path.join(defaultOpt.cwd, 'node_modules', '.bin', options.framework);
  if (!fs.existsSync(frameworkBin)) {
    throw new Error(`Cannot find test framework "${options.framework}" in ${path.join(defaultOpt.cwd, 'node_modules')}`);
  }

  let args = [
    frameworkBin,
    options.directory || defaultOpt.directory
  ];

  if (
    options.framework === 'mocha' &&
    (options.f_options || '').indexOf('--require') === -1
  ) {
    args.push('--require', 'should');
  }
  if (options.f_options) {
    args = args.concat(options.f_options.split(' '));
  }
  options.reporter && args.push('--reporter', options.reporter);
  options.colors && args.push('--colors');
  options.verbose && args.push('--verbose');
  console.log(args);

  let testProcess = childProcess.spawn(process.execPath, args, {
    cwd: path.resolve(options.cwd || defaultOpt.cwd),
    env: _.merge({}, process.env, options.env || {})
  });

  testProcess.stdout.setEncoding('utf8');
  testProcess.stderr.setEncoding('utf8');

  testProcess.stdout.on('data', data => {
    this.emit('data', data);
  });

  testProcess.stderr.on('data', data => {
    this.emit('data', data);
  });

  testProcess.on('error', err => {
    this.emit('error', err);
  });

  testProcess.on('close', (code, signal) => {
    this.emit('close', code, signal);
  });
};

let runner = null;

module.exports = function(options) {
  if (!runner) {
    runner = new Runner();
  }
  runner.removeAllListeners();
  runner.init(options);
  return runner;
};

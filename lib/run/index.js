'use strict';

var co = require('co');
var fs = require('fs');
var path = require('path');
var util = require('util');
var childProcess = require('child_process');
var EventEmitter = require('events');

var _ = require('../common/helper');

var defaultOpt = {
  cwd: process.cwd(),
  directory: 'macaca-test'
};

var server = require('../server');

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
  // lookup framework from local node_modules
  var frameworkBin = lookupFramework(this.options.framework, path.join(defaultOpt.cwd, 'node_modules'));
  if (!frameworkBin) {
    // lookup framework from global node_modules
    frameworkBin = lookupFramework(this.options.framework, '');
  }

  if (!frameworkBin) {
    throw new Error(`Cannot find test framework "${this.options.framework}" in node_modules`);
  }

  if (process.platform === 'win32') {
    frameworkBin += '.cmd';
  }

  var args = ['--require', 'should', this.options.directory || defaultOpt.directory];

  if (this.options.reporter) {
    args.unshift('--reporter', this.options.reporter);
  }

  if (String(this.options.colors) !== 'false') {
    args.unshift('--colors');
  }

  args.unshift(frameworkBin);

  var testProcess = childProcess.spawn(process.execPath, args, {
    cwd: path.resolve(this.options.cwd || defaultOpt.cwd),
    env: _.merge({}, process.env, this.options.env || {})
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

function lookupFramework(framework, filepath) {
  try {
    let frameworkBin = require.resolve(path.join(filepath, framework));
    frameworkBin = path.join(path.dirname(frameworkBin), 'bin', framework);
    // ensure framework exists.
    fs.accessSync(frameworkBin);
    return frameworkBin;
  } catch (e) {}
}

'use strict';

var co = require('co');
var path = require('path');
var util = require('util');
var mocha = require.resolve('mocha');
var childProcess = require('child_process');
var EventEmitter = require('events').EventEmitter;

var _ = require('../common/helper');

var defaultOpt = {
  cwd: process.cwd(),
  directory: 'macaca-test'
};

var mochaBin = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'mocha');

if (process.platform === 'win32') {
  mochaBin += '.cmd';
}

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
    this.initMocha();
  }
};

Runner.prototype.startServer = function() {
  co(server, {
    port: this.options.port,
    window: this.options.window
  }).then(() => {
    this.isRunning = true;
    this.initMocha();
  });
};

Runner.prototype.initMocha = function() {
  var args = [this.options.directory || defaultOpt.directory, '--require', 'should'];

  if (this.options.colors && this.options.colors !== 'false') {
    args.unshift('--colors');
  }

  var mochaProcess = childProcess.spawn(mochaBin, args, {
    cwd: path.resolve(this.options.cwd || defaultOpt.cwd),
    env: _.merge({}, process.env, this.options.env || {}) 
  });

  mochaProcess.stdout.setEncoding('utf8');
  mochaProcess.stderr.setEncoding('utf8');

  mochaProcess.stdout.on('data', data => {
    this.emit('data', data);
  });

  mochaProcess.stderr.on('data', data => {
    this.emit('data', data);
  });

  mochaProcess.on('error', err => {
    this.emit('error', err);
  });

  mochaProcess.on('close', (code, signal) => {
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

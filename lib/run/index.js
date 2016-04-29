'use strict';

var co = require('co');
var util = require('util');
var Mocha = require('macaca-mocha');
var EventEmitter = require('events').EventEmitter;

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
  var mocha = new Mocha({
    cwd: this.options.cwd,
    directory: this.options.directory,
    colors: this.options.colors
  });

  mocha.on('data', data => {
    this.emit('data', data);
  });

  mocha.on('error', err => {
    this.emit('error', err);
  });

  mocha.on('close', (code, signal) => {
    this.emit('close', code, signal);
  });

  this.mocha = mocha;
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

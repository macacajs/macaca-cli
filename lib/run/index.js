/* ================================================================
 * macaca-client by xdf(xudafeng[at]126.com)
 *
 * first created at : Tue Mar 17 2015 00:16:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

var co = require('co');
var util = require('util');
var Mocha = require('macaca-mocha');
var EventEmitter = require('events').EventEmitter;

var server = require('../server');

function Runner(options) {
  EventEmitter.call(this);
  this.options = options;
  this.init();
}

util.inherits(Runner, EventEmitter);

Runner.prototype.init = function() {
  if (this.options.server) {
    this.startServer();
  } else {
    this.initMocha();
  }
};

Runner.prototype.startServer = function() {
  co(server, {
    port: 3456
  }, webdriverServer => {
    this.initMocha(webdriverServer);
  });
};

Runner.prototype.initMocha = function(webdriverServer) {
  var mocha = new Mocha({
    cwd: this.options.cwd,
    directory: this.options.directory,
    colors: this.options.colors
  });

  mocha.on('data', data => {
    this.emit('data', data);
  });

  mocha.on('error', data => {
    this.emit('error', data);
  });

  mocha.on('close', data => {
    this.emit('close', data);
    process.send({
      signal: 'kill'
    });
  });

  this.mocha = mocha;
};

module.exports = Runner;

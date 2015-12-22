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
var server = require('../server');
var Mocha = require('macaca-mocha');
var signal = require('../server').signal;
var EventEmitter = require('events').EventEmitter;

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
  var that = this;
  co(server, {
    port: 3456,
    callback: function() {
      that.initMocha();
    }
  });
};

Runner.prototype.initMocha = function() {
  var mocha = new Mocha({
    cwd: this.options.cwd,
    directory: this.options.directory
  });

  mocha.on('data', function(data) {
    this.emit('data', data);
  }.bind(this));

  mocha.on('error', function(data) {
    this.emit('error', data);
  }.bind(this));

  mocha.on('close', function(data) {
    this.emit('close', data);
    signal('stop');
  }.bind(this));

  this.mocha = mocha;
};

module.exports = Runner;

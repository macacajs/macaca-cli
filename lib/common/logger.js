/* ================================================================
 * mobile-driver by xdf(xudafeng[at]126.com)
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

var util = require('util');
var path = require('path');
var _ = require('./helper');

var TYPES = ['log', 'info', 'debug', 'warn', 'error'];
var COLORS = ['\u001b[32m', '\u001b[36m', '\u001b[37m', '\u001b[33m', '\u001b[31m'];
var logger = {};

function format(msg, data, type) {
  var res = msg[0];

  if (msg.length === 1) {
    return '>> ' + data.file + ':' + data.line + ':' + data.pos + ' ' + res;
  }

  var match = res.match(new RegExp('%s|%d|%j', 'g'));

  if (match) {
    match.forEach(function(type, index) {
      var content = msg[index + 1];
      if (!content) {
        res += type;
      } else if (type === '%s') {
        res = res.replace(new RegExp('%s', 'i'), String(content));
      } else if (type === '%d') {
        res = res.replace(new RegExp('%d', 'i'), Number(content));
      } else if (type === '%j') {
        res = res.replace(new RegExp('%j', 'i'), util.inspect(content, {showHidden: true, depth: null}));
      }
    });
    var num = msg.length - match.length - 1;

    if (num > 0) {
      while (num --) {
        res += ' ' + msg[msg.length - num - 1];
      }
    }
  }

  if (type !== 'info') {
    res = data.file + ':' + data.line + ':' + data.pos + ' ' + res;
  }
  res = '>> ' + res;
  return res;
}

TYPES.forEach(function(type, k) {
  logger[type] = function() {
    var debug = type === 'debug' || _.includes(process.argv, '--verbose');

    if (!debug) {
      return;
    }
    var stack = (new Error()).stack.split('\n');
    var reg = new RegExp('at\\s+(.*)\\s+\\((.*):(\\d*):(\\d*)\\)', 'g');
    var reg2 = new RegExp('at\\s+()(.*):(\\d*):(\\d*)', 'g');
    var arr = reg.exec(stack[2]) || reg2.exec(stack[2]);
    var data = {};
    data.path = arr[2];
    data.line = arr[3];
    data.pos = arr[4];
    data.file = path.basename(data.path);
    data.stack = stack.join('\n');
    console.info(COLORS[k] + TYPES[k].toUpperCase() + ' ' + format(arguments, data, type) + '\u001b[0m');

    if (type === 'error') {
      throw new Error(data);
    }
  };
});

module.exports = logger;

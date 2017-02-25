'use strict';

var logger = require('../logger');
var screenshot = require('./screenshot');
var performance = require('./performance');

function handler(type, log, contentType) {
  if (typeof type !== 'string') {
    throw new TypeError('type must be string.');
  }
  if (typeof log !== 'string') {
    throw new TypeError('log must be string.');
  }
  type = type.trim().toLowerCase();
  log = log.trim();
  switch (type) {
    case 'screenshot':
      if (contentType === 'html') {
        return screenshot(log);
      } else if (contentType === 'tty') {
        logger.debug(log);
        return null;
      }
      break;
    case 'performance':
      performance(log, contentType);
      break;
    default:
      return '';
  }
}

function format(logs, contentType) {
  var pattern = /\<\#([\s\S]*?)\#\>/g;
  return logs.replace(pattern, function(matchStr, identifyStr) {
    var arr = identifyStr.split('|');
    var type = arr[0];
    var log = arr[1];
    if (type && log) {
      var res = handler(type, log, contentType);
      if (res !== '') {
        return res;
      }
    }
    return matchStr;
  });
}

module.exports = format;

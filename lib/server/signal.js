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

var fs = require('fs');
var path = require('path');
var server = require('../server');
var logger = require('../common/logger');
var spawn = require('../common/spawn-promise');

var file = path.join(__dirname, '..', '..', '.config.json');

function killPorcess() {
  return new Promise(function(resolve, reject) {
    fs.readFile(file, 'utf-8', function(err, data) {
      if (err) {
        return reject(err);
      }
      try {
        var options = JSON.parse(data);
        var pid = options.pid;
        var kill = spawn('kill', ['-SIGKILL', pid])
          .then(function() {
            logger.info('server process quit pid:%d', pid);
            return options;
            })
          .catch(function() {
            logger.debug('kill process error pid:%d', pid);
          });
        resolve(kill);
      } catch (err) {
        return reject(err);
      }
    });
  });
}

module.exports = function(signal) {
  switch (signal) {
    case 'stop':
      killPorcess()
        .catch(function(err) {
          logger.warn('kill server error occured %s', err.toString());
        });
      break;
    case 'restart':
      killPorcess()
        .then(function(options) {
          logger.info('restart server with config: %j', options);
          server(options);
        })
        .catch(function(err) {
          logger.warn('restart server error occured %s', err.toString());
        });
      break;
    default:
      logger.warn('arguments `%s` invalid', signal || 'undefined');
      break;
  }
};

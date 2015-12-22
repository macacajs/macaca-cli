/* ================================================================
 * macaca-client by ziczhu(zic.zhu@gmail.com)
 *
 * first created at : Tue Oct 25 2015 12:30:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright ziczhu
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

var childProcess = require('child_process');

module.exports = function(/* command, args, options */) {
  var args = Array.prototype.slice.call(arguments);
  return new Promise(function(resolve, reject) {
    var stdout = '';
    var stderr = '';
    var child = childProcess.spawn.apply(childProcess, args);

    child.on('error', function(error) {
      reject(error);
    });

    child.stdout.on('data', function(data) {
      stdout += data;
    });

    child.stderr.on('data', function(data) {
      stderr += data;
    });

    child.on('close', function(code) {
      var error;
      if (code) {
        error = new Error(stderr);
        error.code = code;
        return reject(error);
      }
      resolve([stdout, stderr]);
    });
  });
};

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

var _ = require('./helper');
var exec = require('child_process').exec;

module.exports = function(cmd, opts) {

  return function(done) {
    exec(cmd, opts, function(err, stdout) {
      done(err, _.trim(stdout));
    });
  };
};

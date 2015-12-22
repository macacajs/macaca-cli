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

var common = require('./common');
var _ = require('../common/helper');
var exec = require('../common/exec');

exports.xcodeInstalled = function *() {
  var version = yield exec('xcode-select -v');

  if (_.include(version, 'version')) {
    version = version.split('version')[1];
    version = version.trim();

    var xcode = yield exec('xcode-select --print-path');
    common.pass('Xcode is installed at: `%s`', xcode);
    common.pass('Xcode Command Line Tools is ready, version: %s', version);
  } else {
    common.fail('Command Line Tools is uninstalled');
  }
};

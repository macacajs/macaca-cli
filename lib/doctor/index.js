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
var ios = require('./ios');
var EOL = require('os').EOL;
var common = require('./common');
var android = require('./android');
var logger = require('../common/logger');

function *parseArgs(options) {
  options.isWindows = options.platform === 'win32';
  options.isMac = options.platform === 'darwin';
  options.isLinux = options.platform === 'linux';
}

function *doctor(options) {

  yield parseArgs(options);

  logger.info('doctor with options: %j', options);

  console.log('\n  \u001b[36mcommon checklist:\u001b[0m\n');

  yield common.checkNodeBinary(options);

  if (options.isMac) {
    console.log('\n  \u001b[36mios checklist:\u001b[0m\n');

    yield ios.xcodeInstalled();
  }

  console.log('\n  \u001b[36mandroid checklist:\u001b[0m\n');

  yield android.check_JAVA_HOME();
  yield android.check_ANDROID_HOME();

  console.log(EOL);
}

module.exports = co(doctor);

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

var ios = require('./ios');
var EOL = require('os').EOL;
var _ = require('macaca-utils');
var common = require('./common');
var android = require('./android');
var logger = require('../common/logger');

function parseOptions(options) {
  _.merge(options, _.platform);
}

function *doctor(options) {

  parseOptions(options);

  logger.info('doctor with options:%s %j', EOL, options);

  console.log(`${EOL}  Node.js checklist:${EOL}`);

  yield common.checkNodeBinary(options);

  if (options.isOSX) {
    console.log(`${EOL}  iOS checklist:${EOL}`);

    yield ios.xcodeInstalled();
  }

  console.log(`${EOL}  Android checklist:${EOL}`);

  yield android.check_JAVA_HOME();
  yield android.check_ANDROID_HOME();

  console.log(EOL);
}

module.exports = doctor;

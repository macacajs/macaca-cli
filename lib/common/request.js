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

var request = require('co-request');
var logger = require('./logger');

module.exports = function *(options) {
  try {
    return yield request(options);
  } catch(err) {
    logger.warn('get remote update info failed.');

    if (err.code === 'ETIMEDOUT') {
      return null;
    }
  }
};

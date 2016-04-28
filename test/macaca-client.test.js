/* ================================================================
 * macaca-cli by xdf(xudafeng[at]126.com)
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

var driver = require('..');

describe('lib/index.js', function() {
  describe('server()', function() {
    it('should be a function', function() {
      driver.server.should.be.a.Function;
    });
  });
});

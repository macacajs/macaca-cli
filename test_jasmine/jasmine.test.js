'use strict';

var assert = require('assert');

var driver = require('../lib');

describe('jasmine', function() {
  describe('driver', function() {
    it('should be a function', function() {
      assert.ok(driver.server instanceof Function);
    });
  });
});

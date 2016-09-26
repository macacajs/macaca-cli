'use strict';

var test = require('ava');

var driver = require('../lib');

test('ava: should be a function', function(t) {
  t.true(driver.server instanceof Function);
});

'use strict';

var driver = require('../lib');

describe('lib/index.js', function() {
  describe('server()', function() {
    it('should be a function', function() {
      driver.server.should.be.a.Function;
    });
  });
});

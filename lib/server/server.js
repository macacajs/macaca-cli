'use strict';

var fs = require('fs');
var path = require('path');
var detect = require('detect-port');
var Webdriver = require('webdriver-server');
var _ = require('../common/helper');

var logger = require('../common/logger');

var file = path.join(__dirname, '..', '..', '.config.json');

var defaultOpt = {
  port: 3456,
  verbose: false,
  always: true
};

function *parseOptions(options) {
  options = _.merge(defaultOpt, options);
  var port = yield detect(options.port);

  if (port !== options.port) {
    logger.info('port: %d was occupied, changed port: %d', options.port, port);
    options.port = port;
  }
}

function *bootstrap(options) {
  yield parseOptions(options);

  var webdriver = new Webdriver(options);

  yield webdriver.start();
  logger.info('webdriver sdk launched');
  fs.writeFileSync(file, JSON.stringify(webdriver.options), 'utf8');
}

module.exports = bootstrap;

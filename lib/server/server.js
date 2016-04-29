'use strict';

var fs = require('fs');
var path = require('path');
var detect = require('detect-port');
var Webdriver = require('webdriver-server');

var logger = require('../common/logger');

var file = path.join(__dirname, '..', '..', '.config.json');

function *parseOptions(options) {
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

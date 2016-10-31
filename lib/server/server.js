'use strict';

var fs = require('fs');
var path = require('path');
var detect = require('detect-port');
var Webdriver = require('webdriver-server');

var _ = require('../common/helper');
var logger = require('../common/logger');
var defaultOpt = require('../common/config').server;

var file = path.join(__dirname, '..', '..', '.config.json');

function *parseOptions(options) {
  options = _.merge(defaultOpt, options);

  var port = yield detect(options.port);

  if (port !== parseInt(options.port, 10)) {
    logger.info('port: %d was occupied, changed port: %d', options.port, port);
    options.port = port;
    process.env.MACACA_SERVER_PORT = port;
  }
  return options;
}

function *bootstrap(options) {
  options = yield parseOptions(options);

  var webdriver = new Webdriver(options);

  yield webdriver.start();
  logger.info('webdriver sdk launched');
  fs.writeFileSync(file, JSON.stringify(webdriver.options), 'utf8');
}

module.exports = bootstrap;

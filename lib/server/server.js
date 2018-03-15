'use strict';

var fs = require('fs');
var path = require('path');
var Webdriver = require('webdriver-server');

var _ = require('../common/helper');
var logger = require('../common/logger');
var defaultOpt = require('../common/config').server;

var detectPort = _.detectPort;

var file = path.join(__dirname, '..', '..', '.config.json');

function * parseOptions(options) {

  if (options.port) {
    options.port = parseInt(options.port, 10);
  }

  options = _.merge(defaultOpt, options);

  var port = yield detectPort(options.port);

  if (port !== parseInt(options.port, 10)) {
    logger.info('port: %d was occupied, changed port: %d', options.port, port);
    options.port = port;
    process.env.MACACA_SERVER_PORT = port;
  }
  return options;
}

function * bootstrap(options) {
  options = yield parseOptions(options);

  var webdriver = new Webdriver(options);

  yield webdriver.start();
  logger.info('Macaca server started');
  fs.writeFileSync(file, JSON.stringify(webdriver.options), 'utf8');
}

module.exports = bootstrap;

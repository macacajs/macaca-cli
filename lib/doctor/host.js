'use strict';

const ip = require('net-tools/lib/ip');

const _ = require('./helper');

exports.checkLocalhost = function *() {

  const res = yield ip.checkLocalhost();

  if (!res.ipv4_reachable || !res.ipv6_reachable) {
    _.logger(`Network checklist:`);
  }

  if (!res.ipv4_reachable) {
    _.fail(`Error, please set hosts: ${_.chalk.white('127.0.0.1 localhost')}`);
  }

  if (!res.ipv6_reachable) {
    _.fail(`Error, please set hosts: ${_.chalk.white('::1 localhost')}`);
  }
};

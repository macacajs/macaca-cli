'use strict';

const semver = require('semver');

const _ = require('./helper');

exports.checkNodeBinary = function * () {
  var node_bin = yield _.exec(_.platform.isWindows ? 'node -e "console.log(process.argv[0])"' : 'which node');

  if (node_bin) {
    _.pass('node env: %s', node_bin);
  } else {
    _.fail('node env error: %s', node_bin);
  }

  var node_version = yield _.exec(_.platform.isWindows ? 'node -e "console.log(process.version)"' : 'node --version');

  var version = 'v16.0.0';

  if (semver.lt(node_version, version)) {
    _.fail('node version: %s lower than %s', node_version, version);
  } else {
    _.pass('node version: %s', node_version);
  }
};

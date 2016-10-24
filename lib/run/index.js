'use strict';

var co = require('co');
var fs = require('fs');
var path = require('path');
var util = require('util');
var childProcess = require('child_process');
var EventEmitter = require('events');

var _ = require('../common/helper');

var defaultOpt = {
  cwd: process.cwd(),
  directory: 'macaca-test'
};

var server = require('../server');

function Runner() {
  EventEmitter.call(this);
  this.isRunning = false;
}

util.inherits(Runner, EventEmitter);

Runner.prototype.init = function(options) {
  this.options = options;
  if (!this.isRunning) {
    this.startServer();
  } else {
    this.initFramework();
  }
};

Runner.prototype.startServer = function() {
  co(server, {
    port: this.options.port,
    window: this.options.window
  }).then(() => {
    this.isRunning = true;
    this.initFramework();
  }).catch((err) => {
    process.nextTick(() => {
      throw err;
    });
  });
};

Runner.prototype.initFramework = function() {
  // lookup framework from local node_modules
  var frameworkBin = lookupFramework(this.options.framework, path.join(defaultOpt.cwd, 'node_modules'));
  if (!frameworkBin) {
    // lookup framework from global node_modules
    frameworkBin = lookupFramework(this.options.framework, '');
  }

  if (!frameworkBin) {
    throw new Error(`Cannot find test framework "${this.options.framework}" in node_modules`);
  }

  if (process.platform === 'win32') {
    frameworkBin += '.cmd';
  }

  var args = ['--require', 'should', this.options.directory || defaultOpt.directory];

  if (this.options.reporter) {
    args.unshift('--reporter', this.options.reporter);
  }

  if (String(this.options.colors) !== 'false') {
    args.unshift('--colors');
  }

  args.unshift(frameworkBin);

  var testProcess = childProcess.spawn(process.execPath, args, {
    cwd: path.resolve(this.options.cwd || defaultOpt.cwd),
    env: _.merge({}, process.env, this.options.env || {})
  });

  testProcess.stdout.setEncoding('utf8');
  testProcess.stderr.setEncoding('utf8');

  testProcess.stdout.on('data', data => {
    this.emit('data', data);
  });

  testProcess.stderr.on('data', data => {
    this.emit('data', data);
  });

  testProcess.on('error', err => {
    this.emit('error', err);
  });

  testProcess.on('close', (code, signal) => {
    this.emit('close', code, signal);
  });
};

let runner = null;

module.exports = function(options) {
  if (!runner) {
    runner = new Runner();
  }
  runner.removeAllListeners();
  runner.init(options);
  return runner;
};

function lookupBin(binMap, framework) {
  let binPath = binMap[framework];
  if (!binPath) {
    const firstBin = Object.keys(binMap)[0]
    if (!firstBin) {
      throw new Error(`No bin file provided in framework ${framework}'s package.json.`);
    }
    binPath = binMap[firstBin];
  }
  return binPath
}

function lookupFramework(framework, filepath) {
  try {
    const pkgPath = path.join(filepath, framework, 'package.json');
    const frameworkPkgDir = path.dirname(require.resolve(pkgPath));
    const frameworkAbsBin = lookupBin(require(pkgPath)['bin'], framework);
    const frameworkBin = path.join(frameworkPkgDir, frameworkAbsBin);
    // ensure framework exists.
    fs.accessSync(frameworkBin);
    return frameworkBin;
  } catch (e) {}
}

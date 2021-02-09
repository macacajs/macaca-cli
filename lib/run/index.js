'use strict';

const co = require('co');
const path = require('path');
const util = require('util');
const EventEmitter = require('events');
const childProcess = require('child_process');

const _ = require('../common/helper');

const defaultOpt = {
  cwd: process.cwd(),
  directory: 'macaca-test'
};

const server = require('../server');

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
  if (process.env.MACACA_RUN_IN_NO_WINDOW === 'true') {
    this.options.window = false;
  }
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
  const options = this.options;
  let framework = options.framework;
  const MACACA_RUN_IN_PARALLEL = !!process.env.MACACA_RUN_IN_PARALLEL;

  // lookup framework from local node_modules
  const rootDir = path.join(defaultOpt.cwd, 'node_modules');

  if (MACACA_RUN_IN_PARALLEL || options.parallel) {
    framework = 'mocha-parallel-tests';
  }

  let frameworkBin = path.join(rootDir, '.bin', framework);

  if (!_.isExistedFile(frameworkBin)) {
    const pkgFile = path.join(rootDir, framework, 'package.json');
    const errMsg = `Cannot find test framework "${framework}" in ${rootDir}`;

    if (_.isExistedFile(pkgFile)) {
      const binMap = require(pkgFile)['bin'] || {};
      if (typeof binMap === 'string') {
        frameworkBin = path.join(rootDir, framework, binMap.split('/').join(path.sep));
      } else if (binMap[framework]) {
        frameworkBin = path.join(rootDir, framework, binMap[framework].split('/').join(path.sep));
      } else {
        throw new Error(errMsg);
      }
    } else {
      throw new Error(errMsg);
    }
  }

  let args = [];

  if (options.directory) {
    args = args.concat(options.directory);
  } else {
    args.push(defaultOpt.directory);
  }

  if (!_.platform.isWindows) {
    args.unshift(frameworkBin);
  }

  if (options.f_options) {
    args = args.concat(options.f_options.split(' '));
  }
  if (options.require) {
    args.push('--require', options.require);
  }
  if (options.reporter) {
    args.push('--reporter', options.reporter);
  }
  if (options.coverageIgnore) {
    args.push('--coverage-ignore', options.coverageIgnore);
  }
  if (options.colors) {
    args.push('--colors');
  }

  if (MACACA_RUN_IN_PARALLEL || options.parallel) {
    options.env = options.env || {};
    options.env.MACACA_RUN_IN_PARALLEL = true;
    args.push('--max-parallel');
    args.push(process.env.MACACA_PARALLEL_RUNNER_NUMBER || 2);
  }

  if (options.verbose) {
    args.push('--verbose');
    console.log(JSON.stringify(args, null, 2));
  }

  var execPath = _.platform.isWindows ? path.join(frameworkBin, '..', '_mocha.cmd') : process.execPath;

  let testProcess = childProcess.spawn(execPath, args, {
    cwd: path.resolve(options.cwd || defaultOpt.cwd),
    env: _.merge({}, process.env, options.env),
    stdio: ['pipe', 'pipe', 'pipe']
  });

  testProcess.stdout.setEncoding('utf8');
  testProcess.stderr.setEncoding('utf8');

  testProcess.stdout.on('data', data => {
    if (typeof data === 'string') {
      data = data.replace(/\r?\n|\r$/, '');
    }
    this.emit('data', data);
  });
  testProcess.stderr.on('data', data => {
    if (typeof data === 'string') {
      data = data.replace(/\r?\n|\r$/, '');
    }
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


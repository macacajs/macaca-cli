'use strict';

const EOL = require('os').EOL;
const utils = require('macaca-utils');
const request = require('co-request');
const childProcess = require('child_process');

const _ = utils.merge({}, utils);

const {
  chalk
} = _;

_.exec = function(cmd, opts) {
  return new Promise((resolve, reject) => {
    childProcess.exec(cmd, _.merge({
      maxBuffer: 1024 * 512,
      wrapArgs: false
    }, opts || {}), (err, stdout) => {
      if (err) {
        return reject(err);
      }
      resolve(_.trim(stdout));
    });
  });
};

_.spawn = function() {
  var args = Array.prototype.slice.call(arguments);
  return new Promise((resolve, reject) => {
    var stdout = '';
    var stderr = '';
    var child = childProcess.spawn.apply(childProcess, args);

    child.on('error', function(error) {
      reject(error);
    });

    child.stdout.on('data', function(data) {
      stdout += data;
    });

    child.stderr.on('data', function(data) {
      stderr += data;
    });

    child.on('close', function(code) {
      var error;
      if (code) {
        error = new Error(stderr);
        error.code = code;
        return reject(error);
      }
      resolve([stdout, stderr]);
    });
  });
};

_.sleep = function(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

_.retry = function(func, interval, num) {
  return new Promise((resolve, reject) => {
    func().then(resolve, err => {
      if (num > 0 || typeof num === 'undefined') {
        _.sleep(interval).then(() => {
          resolve(_.retry(func, interval, num - 1));
        });
      } else {
        reject(err);
      }
    });
  });
};

_.waitForCondition = function(func, wait/*ms*/, interval/*ms*/) {
  wait = wait || 5000;
  interval = interval || 500;
  let start = Date.now();
  let end = start + wait;
  const fn = function() {
    return new Promise((resolve, reject) => {
      const continuation = (res, rej) => {
        let now = Date.now();
        if (now < end) {
          res(_.sleep(interval).then(fn));
        } else {
          rej(`Wait For Condition timeout ${wait}`);
        }
      };
      func().then(isOk => {
        if (!!isOk) {
          resolve();
        } else {
          continuation(resolve, reject);
        }
      }).catch(() => {
        continuation(resolve, reject);
      });
    });
  };
  return fn();
};

_.pass = function() {
  arguments[0] = chalk.green(`  ${arguments[0]}`);
  console.log.apply(this, arguments);
};

_.fail = function() {
  arguments[0] = chalk.red(`  ${arguments[0]}`);
  console.log.apply(this, arguments);
};

_.logger = function(content) {
  console.log(`${EOL}  ${content}${EOL}`);
};

_.request = function *(options) {
  try {
    return yield request(options);
  } catch (err) {
    //console('Get remote update info failed.');
    if (err.code === 'ETIMEDOUT') {
      return null;
    }
  }
};

_.parseGradleVersion = function(data) {
  const match = data.match(/Gradle\s+\d\.\d/);
  return match[0].split(/\s/)[1];
};

module.exports = _;

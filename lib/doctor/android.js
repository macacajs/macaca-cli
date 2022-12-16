'use strict';

const fs = require('fs');
const path = require('path');
const JAVA = require('java-util');

const _ = require('./helper');

const JAVA_HOME = JAVA.JAVA_HOME;

var env = process.env;
var isWindows = _.platform.isWindows;

exports.check_JAVA_VERSION = function *() {
  var str = yield JAVA.getVersion();
  var version = parseFloat(str);
  const MIN_JAVA_VERSION = 1.8;

  if (version >= MIN_JAVA_VERSION) {
    _.pass('JAVA version is `%s`', version);
  } else {
    _.fail(`JAVA require version ${MIN_JAVA_VERSION} and above`);
  }
};

exports.check_GRADLE_VERSION = function *() {
  const GRADLE = 'gradle';
  const MIN_VERSION_STRING = '3.3';
  try {
    const binPath = yield _.exec(`which ${GRADLE}`);
    if (_.isExistedFile(binPath)) {
      const res = yield _.exec(`${GRADLE} -v`);
      const version = _.parseGradleVersion(res);

      if (version.trim() >= MIN_VERSION_STRING) {
        _.pass(`${GRADLE} is installed, version: ${version.trim()}`);
      } else {
        _.fail(`${GRADLE} require version ${MIN_VERSION_STRING} and above`);
      }
    } else {
      _.fail(`Command Line Tools: ${GRADLE} is uninstalled`);
    }
  } catch (e) {
    _.fail(`Command Line Tools: ${GRADLE} is uninstalled`);
  }
};

exports.check_ANDROID_HOME = function *() {

  if (typeof env.ANDROID_HOME !== 'undefined') {
    _.pass('ANDROID_HOME is set to `%s`', env.ANDROID_HOME);

    var platforms = path.join(env.ANDROID_HOME, 'platforms');

    if (!_.isExistedDir(platforms)) {
      return _.fail('Android SDK Platforms directory is not exist, please install the whole thing');
    }

    var res = fs.readdirSync(platforms);

    res = _.filter(res, n => {
      return /android-\d+/.test(n);
    });

    if (!res.length) {
      return _.fail('Android SDK Platforms directory is not exist, please install the whole thing');
    }

    var platformsDir = res[res.length - 1];

    _.pass(`Platforms is set to \`${path.resolve(platforms, platformsDir)}\``);

    var platformsTools = path.join(env.ANDROID_HOME, 'platform-tools');
    var adbToolDir = path.join(platformsTools, isWindows ? 'adb.exe' : 'adb');

    if (!_.isExistedFile(adbToolDir)) {
      return _.fail('ADB tool is not exist');
    }

    _.pass(`ADB tool is set to \`${adbToolDir}\``);

    const sdkLicenseFile = path.join(env.ANDROID_HOME, 'licenses', 'android-sdk-license');

    if (!_.isExistedFile(sdkLicenseFile)) {
      _.fail('Not accepted Android SDK license agreements');
    }
  } else {
    _.fail('ANDROID_HOME is not set');
  }
};

exports.check_JAVA_HOME = function() {
  return new Promise((resolve) => {
    JAVA_HOME.getPath((error, javaHome) => {
      if (error) {
        _.fail('JAVA_HOME is not set');
      } else {
        _.pass('JAVA_HOME is set to `%s`', javaHome);
      }
      resolve();
    });
  });
};

exports.check_GRADLE_HOME = function *() {
  if (typeof env.GRADLE_HOME !== 'undefined') {
    _.pass(`GRADLE_HOME is set to \`${env.GRADLE_HOME}\``);
  } else {
    _.fail('GRADLE_HOME is not set');
  }
};

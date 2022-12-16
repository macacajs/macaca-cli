'use strict';

const {
  drivers
} = require('macaca-cli');
const path = require('path');

const _ = require('./helper');

exports.checkInstalled = function *() {
  var availableList = [];

  for (let i in drivers) {
    const driverName = drivers[i];
    const modName = `macaca-${driverName}`;
    try {
      const driverMainPath = require.resolve(modName);
      const driverPath = path.resolve(driverMainPath, '..', '..');
      availableList.push({
        driverName,
        driverPath,
      });
    } catch (e) {
    }
  }

  for (let i in availableList) {
    const { driverName, driverPath } = availableList[i];
    const modName = `macaca-${driverName}`;
    const mod = require.resolve(modName);
    const pkg = path.join(mod, '..', '..', 'package');
    const currentVersion = require(pkg).version;

    const host = 'registry.cnpmjs.org';
    const protocol = 'http:';

    try {
      const result = yield _.request({
        uri: `${protocol}//${host}/${modName}/latest`,
        method: 'get',
        timeout: 3000
      });

      const data = JSON.parse(result.body);

      if (data && data.version) {
        if (data.version === currentVersion) {
          _.pass(`${driverName}: ${currentVersion}`);
          _.pass(`location: ${driverPath}`);
        } else {
          _.fail(`${driverName}: ${currentVersion} [out-of-date]`);
        }
      } else {
        _.pass(`${driverName}: ${currentVersion}`);
        _.pass(`${driverPath}`);
      }
    } catch (e) {
      _.pass(`${driverName}: ${currentVersion}`);
      _.pass(`location: ${driverPath}`);
    }
    console.log();
  }
};


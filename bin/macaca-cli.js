#!/usr/bin/env node

'use strict';

var co = require('co');
var fs = require('fs');
var path = require('path');
var EOL = require('os').EOL;
var update = require('npm-update');
var program = require('commander');
var spawn = require('child_process').spawn;

var pkg = require('../package');
var _ = require('../lib/common/helper');

var chalk = _.chalk;

_.sudoUserPermissionDenied();

program
  .option('-v, --versions', 'show version and exit')
  .option('--verbose', 'show more debugging information')
  .usage('<command> [options] [arguments]')
  .helpInformation = function() {
    // eslint-disable-next-line no-sparse-arrays
    return [
      '',
      '  ' + chalk.white(pkg.description),
      '',
      '  Usage:',
      '',
      '    ' + this._name + ' ' + this.usage(),,
      '',
      '  Commands:',
      '',
      '    server          start webdriver server',
      '    doctor          detect environment',
      '    run             run testing',
      '    coverage        do coverage',
      '',
      '  Options:',
      '',
      '' + this.optionHelp().replace(/^/gm, '    '),
      '',
      '  Further help:',
      '',
      '  ' + chalk.white(pkg.homepage),
      '',
      ''
    ].join(EOL);
  };

program.parse(process.argv);

if (program.versions) {
  console.info('%s  %s%s', EOL, pkg.version, EOL);
  process.exit(0);
}

var cmd = program.args[0];

if (!cmd) {
  return program.help();
}

var file = path.join(__dirname, `${pkg.name}-${cmd}.js`);

if (!fs.existsSync(file)) {
  console.log('%s  command `%s` not found', EOL, chalk.yellow(cmd));
  program.help();
  return;
}

var printInfo = function(lines) {
  var maxLength = 0;
  lines.forEach(line => {
    maxLength = line.length > maxLength ? line.length : maxLength;
  });

  var res = [new Array(maxLength + 7).join('*')];

  lines.forEach(line => {
    res.push(`*  ${line + new Array(maxLength - line.length + 1).join(' ')}  *`);
  });

  res.push(new Array(maxLength + 7).join('*'));
  console.log(chalk.white(`${EOL}${res.join(EOL)}${EOL}`));
};

function init(_, data) {

  if (data && data.version && pkg.version !== data.version) {
    printInfo([`version ${pkg.version} is outdate`, `run: npm i -g ${pkg.name}@${data.version}`]);
    console.info(`More information: ${chalk.underline(chalk.white(pkg.changelog))}${EOL}`);
  }

  var args = program.rawArgs.slice(3);
  args.unshift(file);

  var bootstrap = spawn('node', args, {
    stdio: [process.stdin, process.stdout, 2, 'ipc']
  });

  bootstrap.on('close', function(code) {
    process.exit('process exited with code ' + code);
  });

  bootstrap.on('exit', function(code) {
    process.exit(code);
  });

  bootstrap.on('message', function(e) {
    switch (e.signal) {
    case 'kill':
      bootstrap.kill();
      break;
    }
  });
}

co(update, {
  pkg: pkg,
  callback: init
});

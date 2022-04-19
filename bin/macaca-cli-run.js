#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const EOL = require('os').EOL;
const program = require('commander');
const Convert = require('ansi-to-html');

const _ = require('../lib/common/helper');
const createRunner = require('../lib').Runner;
const logger = require('../lib/common/logger');
const format = require('../lib/common/logFormatter');

const options = {
  verbose: false,
  framework: 'mocha',
  port: 3456,
  directory: null,
  colors: true,
  cwd: process.cwd()
};

program
  .option('-f, --framework <s>', 'Set test framework (defaults: ' + options.framework + ')')
  .option('-p, --port <d>', 'Set port for server (defaults: ' + options.port + ')')
  .option('-d, --directory <items>', 'Set directory for task runner (defaults: ' + options.directory + ')', value => value.split(','))
  .option('-o, --output [s]', 'Set output html file')
  .option('-r, --reporter <s>', 'Set reporter (default: Spec)')
  .option('-c, --colors <s>', 'Force enabling of colors (defaults: ' + options.colors + ')')
  .option('-C, --no-colors', 'Force disabling of colors')
  .option('--require <name>', 'Require the given module')
  .option('--f_options <s>', 'The options used for test framework itself')
  .option('--coverage-ignore <s>', 'Ignore RegExp used for macaca-coverage')
  .option('--no-window', 'Let Electron runs in silence')
  .option('--parallel', 'Let Electron run in parallel process')
  .option('--verbose', 'Displays more debugging information')
  .parse(process.argv);

_.merge(options, _.getConfig(program));

var output = options.output;

if (output) {
  var filePath;
  var projectName = process.cwd().split(path.sep).pop();
  var date = _.moment().format('YYYY-MM-DD');
  var timestamp = Date.now();
  if (output === true) {
    filePath = path.resolve(process.cwd(), 'macaca-test', `macaca-${projectName}-${date}-${timestamp}.html`);
  } else {
    var o = path.resolve(output);
    if (path.extname(o) === '.html') {
      try {
        var dirPath = path.dirname(o);
        fs.accessSync(path.dirname(dirPath));
      } catch (e) {
        _.mkdir(dirPath);
      }
      filePath = o;
    } else {
      try {
        fs.accessSync(o);
      } catch (e) {
        _.mkdir(o);
      }
      filePath = path.resolve(o, `macaca-${projectName}-${date}-${timestamp}.html`);
    }
  }

  var chunks = [];
  var convert = new Convert({
    newline: true
  });
}

var runner = createRunner(options);

runner.on('data', function(data) {
  if (chunks) {
    chunks.push(format(data, 'html'));
  }
  var log = format(data, 'tty');
  if (log !== 'null') {
    logger.info(log);
  }
});

runner.on('error', function(err) {
  if (chunks) {
    chunks.push(err);
  }
  logger.warn(err);
});

runner.on('close', function(code, signal) {
  if (chunks) {
    try {
      var body = convert.toHtml(chunks.join(EOL));
      var head = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              img {
                width:50%;
              }
              span {
                line-height:50px;
              }
              tr:first-child {
                background-color: #EDEDED;
              }
              th, td {
                padding: 5px 10px;
              }
            </style>
          </head>
          <body style="width:990px;word-break:break-all;margin:0 auto;">`;
      var foot = '</body></html>';
      fs.writeFileSync(filePath, head + body + foot);
    } catch (e) {
      console.log(`Error happened when writing to output html: ${e}`);
    }
  }
  logger.info('Test completed!');
  process.exit(code);
});


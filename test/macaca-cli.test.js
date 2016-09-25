'use strict';

const path = require('path');
const EOL = require('os').EOL;
const CliTest = require('command-line-test');

const pkg = require('../package');

const binFile = path.resolve(pkg.bin.macaca);
const HEADER_DESC = 'Macaca command-line interface';
const SERVER_INFO = 'webdriver server start with config';

describe('macaca command-line test', function() {

  it('`macaca` should be ok', function *() {
    var cliTest = new CliTest();
    var res = yield cliTest.execFile(binFile, [], {});
    var lines = res.stdout.trim().split(EOL);
    lines[0].should.be.equal(HEADER_DESC);
  });

  it('`macaca -h` should be ok', function *() {
    var cliTest = new CliTest();
    var res = yield cliTest.execFile(binFile, ['-h'], {});
    var lines = res.stdout.trim().split(EOL);
    lines[0].should.be.equal(HEADER_DESC);
  });

  it('`macaca run --verbose` should be ok', function *() {
    var cliTest = new CliTest();
    var res = yield cliTest.spawn(binFile, ['run', '--verbose']);
    res.stdout.should.containEql(SERVER_INFO);
  });
});

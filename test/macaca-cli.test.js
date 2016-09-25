'use strict';

const path = require('path');
const EOL = require('os').EOL;
const CliTest = require('command-line-test');

const pkg = require('../package');

const binFile = path.resolve(pkg.bin.macaca);

describe('macaca command-line test', function() {

  it('`macaca -v` should be ok', function *() {
    var cliTest = new CliTest();
    var res = yield cliTest.execFile(binFile, ['-v'], {});
    res.stdout.should.containEql(pkg.version);
  });

  it('`macaca -h` should be ok', function *() {
    var cliTest = new CliTest();
    var res = yield cliTest.execFile(binFile, ['-h'], {});
    var lines = res.stdout.trim().split(EOL);
    lines[0].should.be.equal(pkg.description);
  });

  it('`macaca` should be ok', function *() {
    var cliTest = new CliTest();
    var res = yield cliTest.execFile(binFile, [], {});
    var lines = res.stdout.trim().split(EOL);
    lines[0].should.be.equal(pkg.description);
  });

  it('`macaca run --verbose` should be ok', function *() {
    var cliTest = new CliTest();
    var res = yield cliTest.spawn(binFile, ['run', '--verbose']);
    res.stdout.should.containEql('webdriver sdk launched');
  });

});

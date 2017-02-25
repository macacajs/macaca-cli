'use strict';

require('should');
const path = require('path');
const EOL = require('os').EOL;
const CliTest = require('command-line-test');

const pkg = require('../package');

const binFile = path.resolve(pkg.bin.macaca);

describe('macaca command-line test', function() {
  it('`macaca -v` should be ok', function() {
    var cliTest = new CliTest();
    return cliTest.execFile(binFile, ['-v'], {}).then((res) => {
      res.stdout.should.containEql(pkg.version);
    });
  });

  it('`macaca -h` should be ok', function() {
    var cliTest = new CliTest();
    return cliTest.execFile(binFile, ['-h'], {}).then((res) => {
      var lines = res.stdout.trim().split(EOL);
      lines[0].should.be.equal(pkg.description);
    });
  });

  it('`macaca` should be ok', function() {
    var cliTest = new CliTest();
    return cliTest.execFile(binFile, [], {}).then((res) => {
      var lines = res.stdout.trim().split(EOL);
      lines[0].should.be.equal(pkg.description);
    });
  });

  it('`macaca run --verbose` should be ok', function() {
    this.timeout(5000);
    var cliTest = new CliTest();
    // only empty.test.js for avoiding recursive test
    var args = ['run', '--verbose', '-d', 'test/empty.test.js', '-p', '3457'];
    return cliTest.spawn(binFile, args).then(res => {
      res.stdout.should.containEql('webdriver sdk launched');
      res.stdout.should.containEql('Test completed!');
    });
  });
});

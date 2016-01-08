# macaca-client

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/macaca-client.svg?style=flat-square
[npm-url]: https://npmjs.org/package/macaca-client
[travis-image]: https://img.shields.io/travis/macacajs/macaca-client.svg?style=flat-square
[travis-url]: https://travis-ci.org/macacajs/macaca-client
[coveralls-image]: https://img.shields.io/coveralls/macacajs/macaca-client.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/macacajs/macaca-client?branch=master
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/macaca-client.svg?style=flat-square
[download-url]: https://npmjs.org/package/macaca-client

> Automation driver for mobile.

## Support

- xcode >= 7.2
- android sdk >= 4.4.2
- node >= 4.2.x

## Installment

```bash
$ npm i macaca-client -g
```

## Quick Start

### Start server

```shell
# normal usage
$ macaca server

# set a port
$ macaca server -p 3456

# run in background
$ macaca server -p 3456 &

# send signal to server process
$ dirver -s restart
```

### Run Test

```shell
# run test in current cwd
$ macaca run

# run test in a pointed directry and set a framework
$ macaca run -d ./test -f mocha

# run with a auto run server?
$ macaca run --server --verbose
```
### Environment Doctor

```shell
$ macaca doctor
```
You will get message like this.

### More Help

```shell
$ macaca -h

# helper for server
$ macaca server -h

# helper for how to run test
$ macaca run -h

# helper for environment doctor
$ macaca doctor -h
```
That's all, enjoy it!

## License

[MIT](LICENSE)

Copyright (c) 2014 xdf

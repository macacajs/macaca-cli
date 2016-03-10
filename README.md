# macaca-client

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/macaca-client.svg?style=flat-square
[npm-url]: https://npmjs.org/package/macaca-client
[download-image]: https://img.shields.io/npm/dm/macaca-client.svg?style=flat-square
[download-url]: https://npmjs.org/package/macaca-client

> Client for Macaca.

## Support

- Xcode Version       >= 7.2
- Android SDK Version >= 4.4.2
- Node.js Version     >= 4.2.x

## Installment

```shell
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

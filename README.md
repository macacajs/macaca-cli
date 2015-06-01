macaca-client
=============

> Automation driver for mobile.

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

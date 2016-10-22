current_version = $$(git branch 2>/dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/')
npm_bin= $$(npm bin)
REQUIRED = --require should
TESTS = test

all: test
install:
	@npm install
test:
	@NODE_ENV=test \
		./bin/macaca-cli run -d test && \
		./bin/macaca-cli run -d test -f mocha && \
		./bin/macaca-cli run -d test -f tman && \
		./bin/macaca-cli run -d test_jasmine -f tman && \
		./bin/macaca-cli run -d test_jasmine/jasmine.test.js -f jasmine && \
		./bin/macaca-cli run -d test_ava -f ava
jshint:
	@${npm_bin}/jshint .
.PHONY: test

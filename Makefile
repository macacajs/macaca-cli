current_version = $$(git branch 2>/dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/')
npm_bin= $$(npm bin)
REQUIRED = --require should
TESTS = test

all: test
clean:
	@rm -rf ./node_modules
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
travis: install
	@NODE_ENV=test $(BIN) $(FLAGS) \
		./node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		--report lcovonly \
		-- -u exports \
		$(REQUIRED) \
		$(TESTS) \
		--bail
jshint:
	@${npm_bin}/jshint .
.PHONY: test

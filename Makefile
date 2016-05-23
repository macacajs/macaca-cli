current_version = $$(git branch 2>/dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/')
npm_bin= $$(npm bin)

all: test
clean:
	@rm -rf ./node_modules
install:
	@npm install
test: install
	@node --harmony \
		${npm_bin}/istanbul cover ${npm_bin}/_mocha \
		-- \
		--timeout 10000 \
		--require co-mocha
travis: install test-install
	@NODE_ENV=test $(BIN) $(FLAGS) \
		./node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		--report lcovonly \
		-- -u exports \
		$(REQUIRED) \
		$(TESTS) \
		--bail
test-install:
	./bin/macaca-cli install android
	./bin/macaca-cli install chrome
	./bin/macaca-cli install electron
	./bin/macaca-cli install ios
	./bin/macaca-cli doctor
jshint:
	@${npm_bin}/jshint .
.PHONY: test

current_version = $$(git branch 2>/dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/')
npm_bin= $$(npm bin)

all: test
clean:
	@rm -rf ./node_modules
install:
	@npm install
pull:
	@git pull origin ${current_version}
push:
	@git push origin ${current_version}
publish:
	@npm publish
test: install
	@node --harmony \
		${npm_bin}/istanbul cover ${npm_bin}/_mocha \
		-- \
		--timeout 10000 \
		--require co-mocha
jshint:
	@${npm_bin}/jshint .
.PHONY: test

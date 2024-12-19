types:
	bun check-types

check: types
	bun check

run: check
  bun start

dev: check
  bun dev

build: check
	bun build

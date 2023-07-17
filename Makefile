.POSIX:
.SUFFIXES:

.PHONY: default
default: build

.PHONY: build
build: frontend backend

node_modules:
	npm install

.PHONY: frontend-types
frontend-types: node_modules
	npm run build-types

.PHONY: frontend-js
frontend-js: node_modules
	npm run build-js

.PHONY: frontend
frontend: frontend-types frontend-js

.PHONY: backend
backend: frontend
	go build -o sourdough main.go

.PHONY: run-frontend-js
run-frontend-js: node_modules
	npm run run-js

.PHONY: run-frontend
run-frontend: run-frontend-js

.PHONY: run-backend
run-backend:
	DEBUG=1 go run github.com/cosmtrek/air@latest

.PHONY: run
run: run-frontend run-backend

.PHONY: test
test:
	go test -count=1 ./...
	npm test

.PHONY: release
release: frontend
	goreleaser release --snapshot --rm-dist

.PHONY: deploy
deploy: release
	scp dist/sourdough_linux_amd64.deb derz@sbsbx.com:/tmp
	ssh -t derz@sbsbx.com sudo dpkg -i /tmp/sourdough_linux_amd64.deb

.PHONY: update
update:
	go get -u ./...
	go mod tidy
	npm update

.PHONY: format
format: node_modules
	gofmt -l -s -w .
	npm run format

.PHONY: clean
clean:
	rm -fr sourdough public/index.js dist/

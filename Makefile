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

.PHONY: frontend-css
frontend-css: node_modules
	npm run build-css

.PHONY: frontend
frontend: frontend-types frontend-js frontend-css

.PHONY: backend
backend: frontend
	go build -o sourdough main.go

.PHONY: run-frontend-js
run-frontend-js: node_modules
	npm run run-js

.PHONY: run-frontend-css
run-frontend-css: node_modules
	npm run run-css

.PHONY: run-frontend
run-frontend: run-frontend-js run-frontend-css

.PHONY: run-backend
run-backend:
	DEBUG=1 go run github.com/cosmtrek/air@latest

.PHONY: run
run: run-frontend run-backend

.PHONY: test
test:
	go test -count=1 ./...

.PHONY: release
release: frontend
	goreleaser release --snapshot --clean

.PHONY: deploy
deploy: release
	scp dist/sourdough_linux_amd64.deb derz@sbsbx.com:/tmp
	ssh -t derz@sbsbx.com sudo dpkg -i /tmp/sourdough_linux_amd64.deb

.PHONY: update-frontend
update-frontend:
	npm update

.PHONY: update-backend
update-backend:
	go get -u ./...
	go mod tidy

.PHONY: update
update: update-frontend update-backend

.PHONY: format-frontend
format-frontend: node_modules
	npm run format

.PHONY: format-backend
format-backend:
	gofmt -l -s -w .

.PHONY: format
format: format-frontend format-backend

.PHONY: clean
clean:
	rm -fr sourdough public/index.js public/index.js.map public/index.css dist/ tmp/

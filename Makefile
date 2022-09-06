.POSIX:
.SUFFIXES:

.PHONY: default
default: build

.PHONY: build
build: frontend backend

node_modules:
	npm install

.PHONY: frontend
frontend: node_modules
	npm run build

.PHONY: backend
backend: frontend
	go build -o sourdough main.go

.PHONY: run-frontend
run-frontend: node_modules
	npm run dev

.PHONY: run-backend
run-backend: frontend
	go run main.go

.PHONY: test
test:
	go test -v ./...

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
	rm -fr sourdough dist/ node_modules/ public/main.js

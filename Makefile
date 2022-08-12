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
	go build -o webgl backend/main.go

.PHONY: run-frontend
run-frontend: node_modules
	npm run dev

.PHONY: run-backend
run-backend: backend
	./webgl

.PHONY: release
release:
	goreleaser release --snapshot --rm-dist

.PHONY: deploy
deploy: release
	scp dist/webgl_linux_amd64.deb derz@derzchat.com:/tmp
	ssh -t derz@derzchat.com sudo dpkg -i /tmp/webgl_linux_amd64.deb

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
	rm -fr webgl dist/ node_modules/ backend/web/public/

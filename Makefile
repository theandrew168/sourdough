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

.PHONY: update
update:
	go get -u ./...
	go mod tidy
	npm update

.PHONY: format
format: node_modules
	gofmt -l -s -w .
	npm run format

.PHONY: lint
lint: node_modules
	go run github.com/golangci/golangci-lint/cmd/golangci-lint@latest run --fast --issues-exit-code 0
	npm run lint

.PHONY: clean
clean:
	rm -fr webgl backend/web/public/ node_modules/

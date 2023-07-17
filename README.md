# Sourdough

Projects that people can appreciate

## Setup

This project depends on the [Go programming language](https://golang.org/dl/) and [NodeJS JavaScript environment](https://nodejs.org/en).
I like to use a [POSIX-compatible Makefile](https://pubs.opengroup.org/onlinepubs/9699919799.2018edition/utilities/make.html) to facilitate the various project operations but traditional [Go commands](https://pkg.go.dev/cmd/go) and [NPM scripts](https://docs.npmjs.com/cli/v9/commands/npm-run-script) will work just as well.

On macOS, these dependencies can be easily installed via [Homebrew](https://brew.sh/):

```
brew install go node
```

## Building

To build the application into a standalone binary, run:

```
make -j4
```

## Running

To run (and auto-reload) the backend and frontend simultaneously (needs at least `-j3`):

```
make -j4 run
```

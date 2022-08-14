# sourdough
Projects that people can appreciate

## Setup
This project depends on the [Go programming language](https://golang.org/dl/) and [NodeJS](https://nodejs.org/en/).

## Building
To build the application into a standalone binary, run:
```bash
make
```

## Local Development
### Services
This project uses [Redis](https://redis.io/) for ephemeral storage and caching.
To develop locally, you'll need to run these services locally somehow or another.
I find [Docker](https://www.docker.com/) to be a nice tool for this but you can do whatever works best.

The following command starts the necessary containers:
```
docker compose up -d
```

These containers can be stopped via:
```
docker compose down
```

### Running
To start the frontend web server:
```bash
make run-frontend
```

To start the backend web server:
```bash
make run-backend
```

package main

import (
	"context"
	"embed"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/coreos/go-systemd/daemon"
	"golang.org/x/exp/slog"

	"github.com/theandrew168/sourdough/backend/web"
)

//go:embed public
var publicFS embed.FS

func main() {
	os.Exit(run())
}

func run() int {
	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	app := web.NewApplication(logger, publicFS)

	port := "5000"
	if os.Getenv("PORT") != "" {
		port = os.Getenv("PORT")
	}
	addr := fmt.Sprintf("127.0.0.1:%s", port)

	// let systemd know that we are good to go (no-op if not using systemd)
	daemon.SdNotify(false, daemon.SdNotifyReady)

	ctx := newSignalHandlerContext()
	err := app.Run(ctx, addr)
	if err != nil {
		logger.Error(err.Error())
		return 1
	}

	return 0
}

// create a context that cancels upon receiving an exit signal
func newSignalHandlerContext() context.Context {
	ctx, cancel := context.WithCancel(context.Background())
	go func() {
		// idle until a signal is caught (must be a buffered channel)
		quit := make(chan os.Signal, 1)
		signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
		<-quit

		cancel()
	}()

	return ctx
}

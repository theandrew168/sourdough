package main

import (
	"embed"
	"fmt"
	"net/http"
	"os"

	"github.com/coreos/go-systemd/daemon"

	"github.com/theandrew168/sourdough/backend/web"
)

//go:embed public
var publicFS embed.FS

func main() {
	os.Exit(run())
}

func run() int {
	// let systemd know that we are good to go (no-op if not using systemd)
	daemon.SdNotify(false, daemon.SdNotifyReady)

	app := web.NewApplication(publicFS)

	port := "5000"
	if os.Getenv("PORT") != "" {
		port = os.Getenv("PORT")
	}
	addr := fmt.Sprintf("127.0.0.1:%s", port)

	fmt.Printf("listening on %s\n", addr)
	err := http.ListenAndServe(addr, app.Handler())
	if err != nil {
		fmt.Println(err)
		return 1
	}

	return 0
}

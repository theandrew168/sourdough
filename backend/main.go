package main

import (
	"net/http"

	"github.com/coreos/go-systemd/daemon"

	"git.sr.ht/~theandrew168/webgl/backend/web"
)

func main() {
	// let systemd know that we are good to go (no-op if not using systemd)
	daemon.SdNotify(false, daemon.SdNotifyReady)

	app := web.NewApplication()
	http.ListenAndServe("127.0.0.1:5000", app.Handler())
}

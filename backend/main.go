package main

import (
	"net/http"

	"git.sr.ht/~theandrew168/webgl/backend/web"
)

func main() {
	app := web.NewApplication()
	http.ListenAndServe("127.0.0.1:5000", app.Handler())
}

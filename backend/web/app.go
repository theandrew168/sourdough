package web

import (
	"io/fs"
	"net/http"

	"github.com/alexedwards/flow"
	"github.com/klauspost/compress/gzhttp"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type Application struct {
	public fs.FS
}

func NewApplication(publicFS fs.FS) *Application {
	public, err := fs.Sub(publicFS, "public")
	if err != nil {
		panic(err)
	}

	app := Application{
		public: public,
	}
	return &app
}

func (app *Application) Handler() http.Handler {
	mux := flow.New()

	// healthcheck endpoint
	mux.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		w.Write([]byte("pong\n"))
	}, "GET")

	// prometheus metrics
	mux.Handle("/metrics", promhttp.Handler(), "GET")

	public := http.FileServer(http.FS(app.public))
	mux.Handle("/...", gzhttp.GzipHandler(public))

	return mux
}

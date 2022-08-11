package web

import (
	"embed"
	"io/fs"
	"net/http"
)

//go:embed public
var publicFS embed.FS

type Application struct {
	public fs.FS
}

func NewApplication() *Application {
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
	return http.FileServer(http.FS(app.public))
}

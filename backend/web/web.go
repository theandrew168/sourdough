package web

import (
	"embed"
	"io/fs"
	"net/http"
)

//go:embed public
var publicFS embed.FS

func PublicFiles() http.Handler {
	public, _ := fs.Sub(publicFS, "public")
	return http.FileServer(http.FS(public))
}

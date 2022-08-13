package web

import (
	"fmt"
	"net/http"
)

func (app *Application) logRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf(
			"%s - %s %s %s\n",
			r.RemoteAddr,
			r.Proto,
			r.Method,
			r.URL.RequestURI(),
		)

		ua := r.Header.Get("User-Agent")
		fmt.Printf("  User-Agent: %s\n", ua)

		next.ServeHTTP(w, r)
	})
}

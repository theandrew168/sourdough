package main

import (
	"context"
	"embed"
	"flag"
	"fmt"
	"net/http"
	"os"

	"github.com/go-redis/redis/v9"
	"github.com/coreos/go-systemd/daemon"

	"git.sr.ht/~theandrew168/sourdough/backend/config"
	"git.sr.ht/~theandrew168/sourdough/backend/web"
)

//go:embed public
var publicFS embed.FS

func main() {
	os.Exit(run())
}

func run() int {
	conf := flag.String("conf", "sourdough.conf", "app config file")
	flag.Parse()

	cfg, err := config.ReadFile(*conf)
	if err != nil {
		fmt.Println(err)
		return 1
	}

	opts, err := redis.ParseURL(cfg.RedisURL)
	if err != nil {
		fmt.Println(err)
		return 1
	}

	rdb := redis.NewClient(opts)
	pong, err := rdb.Ping(context.Background()).Result()
	if err != nil {
		fmt.Println(err)
		return 1
	}

	fmt.Println(pong)

	// let systemd know that we are good to go (no-op if not using systemd)
	daemon.SdNotify(false, daemon.SdNotifyReady)

	app := web.NewApplication(publicFS)

	port := cfg.Port
	if os.Getenv("PORT") != "" {
		port = os.Getenv("PORT")
	}
	addr := fmt.Sprintf("127.0.0.1:%s", port)

	fmt.Printf("listening on %s\n", addr)
	err = http.ListenAndServe("127.0.0.1:5000", app.Handler())
	if err != nil {
		fmt.Println(err)
		return 1
	}

	return 0
}

package main

import (
	"go-chat-manager/web"
	"os"
)

func main() {

	spaPath := os.Getenv("SPA_PATH")
	if spaPath == "" {
		spaPath = "./html"
	}

	server := web.NewServer(spaPath)

	server.StartServer()
}

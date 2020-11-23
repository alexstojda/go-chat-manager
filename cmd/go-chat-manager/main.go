package main

import (
	"go-chat-manager/internal/chat"
	"go-chat-manager/web"
	"os"
)

func main() {

	spaPath := os.Getenv("SPA_PATH")
	if spaPath == "" {
		spaPath = "/app/build"
	}

	chatManager := chat.NewManager()

	server := web.NewServer(spaPath, chatManager)

	server.StartServer()
}

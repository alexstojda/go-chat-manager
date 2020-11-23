package web

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/logger"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"go-chat-manager/internal/chat"
	chatapi "go-chat-manager/web/api/chat"
	"go-chat-manager/web/api/health"
)

type Server struct {
	SPAPath string
	Health  *health.Health
	Chat    *chatapi.Chat
}

func NewServer(spaPath string, chatManager chat.ManagerService) *Server {
	return &Server{
		SPAPath: spaPath,
		Health:  health.NewHealth(),
		Chat:    chatapi.NewChat(chatManager),
	}
}

func (s *Server) StartServer() {
	router := gin.New()

	zerolog.SetGlobalLevel(zerolog.InfoLevel)
	if gin.IsDebugging() {
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
	}

	router.Use(logger.SetLogger(logger.Config{
		SkipPath: []string{
			"/health",
		},
	}))

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{"Content-Type"},
		AllowMethods: []string{"POST", "DELETE"},
	}))

	router.Use(errorHandler)

	// SPA ROUTE

	// API ROUTES
	router.GET("/api/health", s.Health.Get)
	router.GET("/api/chat", s.Chat.GetMessages)
	router.POST("/api/chat", s.Chat.PostMessage)
	router.DELETE("/api/chat", s.Chat.DeleteMessages)

	log.Debug().Msg("Using " + s.SPAPath)
	router.Use(static.Serve("/", static.LocalFile(s.SPAPath, true)))

	err := router.Run()
	if err != nil {
		log.Error().Msgf("Web server startup failed with error %s", err)
	}
}

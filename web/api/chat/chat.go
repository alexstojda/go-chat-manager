package chat

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"go-chat-manager/internal/chat"
	"io/ioutil"
	"net/http"
)

type Chat struct {
	chatManager chat.ManagerService
}

func NewChat(chatManager chat.ManagerService) *Chat {
	return &Chat{
		chatManager: chatManager,
	}
}

type Response struct {
	Messages []chat.Message `json:"messages"`
}

func (ch *Chat) GetAllMessages(c *gin.Context) {
	messages, err := ch.chatManager.GetMessages(nil, nil)
	if err != nil {
		c.Error(err)
		return
	}

	response := Response{
		Messages: messages,
	}

	c.JSON(http.StatusOK, response)
}

func (ch *Chat) PostMessage(c *gin.Context) {
	message := &chat.Message{}

	data, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		c.Error(err)
		return
	}

	err = json.Unmarshal(data, message)
	if err != nil {
		c.Error(err)
		return
	}

	err = ch.chatManager.SaveMessage(*message)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(201, message)
}

package chat

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"go-chat-manager/internal/chat"
	"io/ioutil"
	"net/http"
	"time"
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

func (ch *Chat) GetMessages(c *gin.Context) {
	var start *time.Time = nil
	var end *time.Time = nil

	if val, ok := c.GetQuery("start"); ok {
		t, err := time.Parse(time.RFC3339Nano, val)
		if err != nil {
			_ = c.Error(err)
			return
		} else {
			start = &t
		}
	}

	if val, ok := c.GetQuery("end"); ok {
		t, err := time.Parse(time.RFC3339Nano, val)
		if err != nil {
			_ = c.Error(err)
			return
		} else {
			end = &t
		}
	}

	messages, err := ch.chatManager.GetMessages(start, end)
	if err != nil {
		_ = c.Error(err)
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

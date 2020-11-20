package chat

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"go-chat-manager/internal/chat"
	"io/ioutil"
	"net/http"
	"strings"
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
	Messages []chat.Message `json:"messages" xml:"Message"`
}

func (ch *Chat) GetMessages(c *gin.Context) {
	var start *time.Time = nil
	var end *time.Time = nil

	if val, ok := c.GetQuery("start"); ok && val != "" {
		t, err := time.Parse(time.RFC3339Nano, val)
		if err != nil {
			_ = c.Error(err)
			return
		} else {
			start = &t
		}
	}

	if val, ok := c.GetQuery("end"); ok && val != "" {
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

	accepts := strings.Split(c.Request.Header.Values("Accept")[0], ",")

	if has(accepts, "application/json") || c.Query("format") == "application/json" {
		if _, ok := c.GetQuery("download"); ok {
			c.Header("Content-Disposition", "file=data.json")
		}
		c.JSON(http.StatusOK, response)
	} else if has(accepts, "application/xml") || c.Query("format") == "application/xml" {
		if _, ok := c.GetQuery("download"); ok {
			c.Header("Content-Disposition", "file=data.xml")
		}
		c.XML(http.StatusOK, response)
	} else {
		if _, ok := c.GetQuery("download"); ok {
			c.Header("Content-Disposition", "file=data.xml")
		}
		c.Data(http.StatusOK, "text/plain", []byte(plaintextResponse(messages)))
	}
}

func plaintextResponse(messages []chat.Message) string {
	response := ""
	for _, m := range messages {
		response = fmt.Sprintf("%s[%s] %s >_ %s\r\n", response, m.SentAt.UTC().Format(time.RFC3339Nano), m.Sender, m.Message)
	}
	return response
}

func has(slice []string, val string) bool {
	for _, item := range slice {
		if item == val {
			return true
		}
	}
	return false
}

func (ch *Chat) DeleteMessages(c *gin.Context) {
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

	err := ch.chatManager.ClearMessages(start, end)
	if err != nil {
		_ = c.Error(err)
		return
	}

	c.AbortWithStatus(http.StatusNoContent)
}

func (ch *Chat) PostMessage(c *gin.Context) {
	message := &chat.Message{}

	data, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		_ = c.Error(err)
		return
	}

	err = json.Unmarshal(data, message)
	if err != nil {
		_ = c.Error(err)
		return
	}

	err = ch.chatManager.SaveMessage(*message)
	if err != nil {
		_ = c.Error(err)
		return
	}

	c.JSON(http.StatusCreated, message)
}

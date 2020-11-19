package chat

import "time"

type Message struct {
	Sender  string    `json:"sender"`
	Message string    `json:"message"`
	SentAt  time.Time `json:"sentAt"`
}

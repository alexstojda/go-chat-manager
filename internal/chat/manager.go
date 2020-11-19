package chat

import "time"

type ManagerService interface {
	SaveMessage(message Message) error
	GetMessages(start *time.Time, end *time.Time) (results []Message, err error)
	ClearMessages(start *time.Time, end *time.Time) (err error)
}

type Manager struct {
	chatLog map[time.Time]Message
}

func NewManager() ManagerService {
	return &Manager{
		chatLog: map[time.Time]Message{},
	}
}

func (m *Manager) SaveMessage(message Message) error {
	if message.Sender == "" {
		message.Sender = "Anonymous"
	}

	message.SentAt = time.Now().UTC()

	m.chatLog[message.SentAt] = message
	return nil
}

func (m *Manager) GetMessages(start *time.Time, end *time.Time) (results []Message, err error) {
	results = []Message{}
	for index, message := range m.chatLog {
		if start != nil && end == nil {
			if index.After(*start) {
				results = append(results, message)
			}
		} else if start == nil && end != nil {
			if index.Before(*end) {
				results = append(results, message)
			}
		} else if start != nil && end != nil {
			if index.After(*start) && index.Before(*end) {
				results = append(results, message)
			}
		} else {
			results = append(results, message)
		}
	}

	return results, nil
}

func (m *Manager) ClearMessages(start *time.Time, end *time.Time) (err error) {
	for index := range m.chatLog {
		if start != nil && end == nil {
			if index.After(*start) {
				delete(m.chatLog, index)
			}
		} else if start == nil && end != nil {
			if index.Before(*end) {
				delete(m.chatLog, index)
			}
		} else if start != nil && end != nil {
			if index.After(*start) && index.Before(*end) {
				delete(m.chatLog, index)
			}
		} else {
			delete(m.chatLog, index)
		}
	}

	return nil
}

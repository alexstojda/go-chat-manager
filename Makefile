mod:
	go mod download

build:
	go build -v -o go-chat-manager ./cmd/go-chat-manager/

run-backend:
	go run cmd/go-chat-manager/main.go

run-frontend:
	REACT_APP_API_HOST=http://localhost:8080 npm run start

#test:
#	@go test ./...
#
#test-cov:
#	mkdir -p coverage
#	@go test -covermode=atomic -coverprofile=./coverage/coverage.txt ./...
#	@go get github.com/axw/gocov/gocov
#	@go get github.com/AlekSi/gocov-xml
#	@gocov convert ./coverage/coverage.txt | gocov-xml > ./coverage/coverage.xml
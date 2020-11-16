mod:
	go mod download

build:
	go build -v -o go-chat-manager ./cmd/go-chat-manager/

run:
	go run cmd/go-chat-manager/main.go
#
#test:
#	@go test ./...
#
#test-cov:
#	mkdir -p coverage
#	@go test -covermode=atomic -coverprofile=./coverage/coverage.txt ./...
#	@go get github.com/axw/gocov/gocov
#	@go get github.com/AlekSi/gocov-xml
#	@gocov convert ./coverage/coverage.txt | gocov-xml > ./coverage/coverage.xml
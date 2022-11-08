FROM node:18-alpine AS node-dev

RUN mkdir -p /app/node
WORKDIR /app/node
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

ENTRYPOINT ["npm"]

FROM golang:1.19-alpine AS go-dev

ENV CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# openssh-client ca-certificates && update-ca-certificates 2>/dev/null || true
RUN apk add --no-cache git make

ENV HOME=/home/golang
WORKDIR /app/go
RUN adduser -h $HOME -D -u 1000 -G root golang && \
    chown golang:root /app/go && \
    chmod g=u /app/go $HOME
USER golang:root

COPY --chown=golang:root go.mod go.sum Makefile ./

# Fetch public dependencies only
RUN make mod

# Fetch Private & Public Dependencies
#ARG SSH_PRIVATE_KEY
#RUN mkdir -p $HOME/.ssh && \
#    umask 0077 && \
#    echo "${SSH_PRIVATE_KEY}" >> $HOME/.ssh/id_rsa && \
#    ssh-keyscan github.com >> $HOME/.ssh/known_hosts && \
#    git config --global url."git@github.com:".insteadOf https://github.com/ && \
#    make mod && \
#    rm -rf $HOME/.ssh

COPY --chown=golang:root . ./
RUN go build -v -o go-chat-manager ./cmd/go-chat-manager/

ENTRYPOINT ["make"]
#CMD ["test"]

###

FROM scratch AS prod

COPY --from=go-dev /etc/passwd /etc/group  /etc/
#COPY --from=development /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
# Kube crashes if there isn't a tmp directory to write error logs to
COPY --from=go-dev --chown=golang:root /tmp /tmp
COPY --from=go-dev --chown=golang:root /app/go/go-chat-manager /app/
COPY --from=node-dev --chown=golang:root /app/node/build/ /app/build/

USER golang:root
EXPOSE 8080
ENTRYPOINT ["/app/go-chat-manager"]

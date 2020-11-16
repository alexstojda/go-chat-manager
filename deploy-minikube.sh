#!/bin/sh
set -o errexit -o nounset
cd `dirname $0`

kubectl config use-context minikube

eval $(minikube docker-env --shell=bash)

docker-compose build go-chat-manager
kubectl delete deployment go-chat-manager || true
kubectl apply -f .minikube
kubectl rollout status deployment/go-chat-manager
kubectl get deployment go-chat-manager
echo "Deployed on $(minikube service go-chat-manager --url)"
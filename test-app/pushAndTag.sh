docker buildx build --platform linux/amd64 -t reactapp-amd64 .
docker tag reactapp-amd64 gcr.io/model-coral-369515/reactapp-amd64
docker push gcr.io/model-coral-369515/reactapp-amd64
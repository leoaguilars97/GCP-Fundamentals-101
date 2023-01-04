FROM node:17-alpine
WORKDIR /app
COPY . .
RUN npm install
ENV GOOGLE_APPLICATION_CREDENTIALS="./storage.key.json"
ENV DB_HOST="CLOUD_SQL_IP"
EXPOSE 3000
CMD [ "node", "index"]

# 
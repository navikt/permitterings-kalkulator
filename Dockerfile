FROM node:11-alpine
ENV NODE_ENV production

WORKDIR /app
COPY server.js ./
COPY build/ ./build

CMD ["node", "./server.js"]

EXPOSE 3000

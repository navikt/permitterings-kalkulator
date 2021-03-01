FROM navikt/node-express:12.2.0-alpine
ENV NODE_ENV production

WORKDIR /app
COPY server ./server
COPY build/ ./build

WORKDIR /app/server
RUN yarn install --frozen-lockfile

EXPOSE 3000
CMD ["node", "server.js"]

# Skal oppdateres til v.14
FROM navikt/node-express:14.0.0-alpine

ENV NODE_ENV=production


WORKDIR /app
COPY server ./server
COPY build/ ./build

WORKDIR /app/server
RUN yarn install --frozen-lockfile

EXPOSE 3000
ENTRYPOINT ["yarn", "server"]

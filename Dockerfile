# Skal oppdateres til v.14
FROM navikt/node-express:12.2.0-alpine

ENV NODE_ENV=production

WORKDIR /app
COPY server ./server
COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install --frozen-lockfile
RUN yarn build

EXPOSE 3000
ENTRYPOINT ["yarn", "server"]

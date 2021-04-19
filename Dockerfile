# Skal oppdateres til v.14
FROM navikt/node-express:12.2.0-alpine

ENV NODE_ENV=production

COPY server/ server/
COPY static/ static/
COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install --frozen-lockfile

EXPOSE 3000
ENTRYPOINT ["yarn", "start"]

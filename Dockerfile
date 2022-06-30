# Skal oppdateres til v.14
FROM navikt/node-express:16

ENV NODE_ENV=production


WORKDIR /var
COPY server ./server
COPY build/ ./build

WORKDIR /var/server
RUN yarn install --frozen-lockfile

EXPOSE 3000
ENTRYPOINT ["yarn", "server"]

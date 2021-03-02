require('./set-env-variables');
require('console-stamp')(console, '[HH:MM:ss.l]');

const express = require('express');
const sanity = require('./sanity-utils');
const template = require('./template');

const path = require('path');

const server = express();
const PORT = process.env.PORT || 3000;
const buildPath = path.join(__dirname, '../build');

const BASE_PATH = '/arbeidsgiver-permittering';

const sendDataObj = (json) => ({
    data: json,
    env: [process.env.SANITY_PROJECT_ID, process.env.SANITY_DATASET],
});

const addHeadersForCertainRequests = () =>
    server.use((req, res, next) => {
        if (template.corsWhitelist.includes(req.headers.origin)) {
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            );
            res.header(
                'Access-Control-Allow-Methods',
                'GET, HEAD, OPTIONS, POST, PUT'
            );
            res.setHeader(
                'Access-Control-Allow-Headers',
                'X-Requested-With,content-type'
            );
            res.setHeader('Access-Control-Allow-Credentials', true);
        }

        next();
    });

const startServer = () => {
    addHeadersForCertainRequests();

    server.get(`${BASE_PATH}/innhold/`, (req, res) => {
        const cacheInnhold = sanity.mainCacheInnhold.get(
            sanity.mainCacheInnholdKey
        );
        cacheInnhold
            ? res.send(sendDataObj(cacheInnhold))
            : sanity.fetchInnhold(res);
    });

    server.use(BASE_PATH + '/', express.static(buildPath, { index: false }));

    server.get(`${BASE_PATH}/internal/isAlive`, (req, res) =>
        res.sendStatus(200)
    );
    server.get(`${BASE_PATH}/internal/isReady`, (req, res) =>
        res.sendStatus(200)
    );

    server.get(BASE_PATH + '/*', async (req, res) => {
        try {
            res.send(await getHtmlWithDecorator(buildPath + '/index.html'));
        } catch (e) {
            console.error(e);
            res.status(500).send(e);
        }
    });

    server.listen(PORT, () => {
        console.log('Server listening on port', PORT);
    });
};

startServer();

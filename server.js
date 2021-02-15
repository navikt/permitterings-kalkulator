// env
const VAULT_PATH = '/var/run/secrets/nais.io/vault/environment.env';
require('console-stamp')(console, '[HH:MM:ss.l]');
require('dotenv').config({
    path: process.env.NODE_ENV === 'production' ? VAULT_PATH : '.env',
});

// imports
const path = require('path');
const express = require('express');
const helmet = require('helmet');

const decoratorUtils = require('./server/decorator-utils');
const template = require('./server/template');
const sanity = require('./server/sanity-utils');

// env
const server = express();
server.use(helmet());

const BASE_URL = '/arbeidsgiver-permittering';

//server response to pipeline
server.get('/arbeidsgiver-permittering/internal/isAlive', (req, res) =>
    res.sendStatus(200)
);
server.get('/arbeidsgiver-permittering/internal/isReady', (req, res) =>
    res.sendStatus(200)
);

const sendDataObj = (json) => ({
    data: json,
    env: [process.env.SANITY_PROJECT_ID, process.env.SANITY_DATASET],
});

const setHeaders = (responsheader) => {
    responsheader.setHeader('Access-Control-Allow-Origin', '*');
    responsheader.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );
    responsheader.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type'
    );
    responsheader.setHeader('Access-Control-Allow-Credentials', true);
};

const setBuildpathStatic = (subpath) => {
    return express.static(path.join(__dirname, `build/${subpath}`));
};

const serverUse = (staticPath) => {
    return server.use(
        `${BASE_URL}/${staticPath}`,
        setBuildpathStatic(staticPath)
    );
};

// sanity innhold
server.get(`${BASE_URL}/innhold/`, (req, res) => {
    setHeaders(res);
    const cacheInnhold = sanity.mainCacheInnhold.get(
        sanity.mainCacheInnholdKey
    );
    cacheInnhold
        ? res.send(sendDataObj(cacheInnhold))
        : sanity.fetchInnhold(res);
});

const serveAppWithMenu = (app) => {
    template.staticPaths.forEach((staticPath) => serverUse(staticPath));
    server.get([`${BASE_URL}/`, `${BASE_URL}/*`], (req, res) => {
        res.send(app);
    });
    setServerPort();
};

const setServerPort = () => {
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log('server listening on port', port);
    });
};

const serveAppWithOutMenu = () => {
    server.use(BASE_URL, express.static(path.join(__dirname, 'build')));
    server.get(`${BASE_URL}/*`, (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    });
    setServerPort();
};

decoratorUtils.getMenuAndServeApp();

module.exports.serveAppWithOutMenu = serveAppWithOutMenu;
module.exports.serveAppWithMenu = serveAppWithMenu;

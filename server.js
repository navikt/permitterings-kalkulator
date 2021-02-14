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

const NodeCache = require('node-cache');
const sanityClient = require('@sanity/client');
const decoratorUtils = require('./server/decorator-utils');
const template = require('./server/template');

// env
const server = express();
server.use(helmet());

const BASE_URL = '/arbeidsgiver-permittering';

const client = sanityClient({
    projectId: process.env.SANITY_PROJECT_ID?.trim(),
    dataset: process.env.SANITY_DATASET?.trim(),
    token: process.env.SANITY_TOKEN?.trim(),
    useCdn: false,
});

// Cache init

const mainCacheInnholdKey = 'permittering-innhold';
const backupCacheInnholdKey = 'permittering-innholdBackup';

const mainCacheInnhold = new NodeCache({
    stdTTL: parseInt(process.env.SANITY_CACHE_TTL),
    checkperiod: parseInt(process.env.SANITY_CACHE_CHECK),
});
const backupCacheInnhold = new NodeCache({ stdTTL: 0, checkperiod: 0 });

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

const sanityQuery = () =>
    template
        .sanityQueryKeys()
        .map((queryfragment, index) => {
            return index === 0
                ? `*[_type == '${queryfragment}' ||`
                : index === template.sanityQueryKeys().length - 1
                ? `_type == '${queryfragment}'] | order(_type, priority)`
                : `_type == '${queryfragment}' ||`;
        })
        .join(' ');

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

const checkbackupCacheInnhold = (res, fetchError) => {
    const cacheBackupInnhold = backupCacheInnhold.get(backupCacheInnholdKey);
    if (cacheBackupInnhold) {
        mainCacheInnhold.set(mainCacheInnholdKey, cacheBackupInnhold);
        res.send(cacheBackupInnhold);
    } else {
        console.log('fetchError', fetchError);
        res.send(fetchError);
    }
};

const fetchInnhold = (res) => {
    const query = sanityQuery();
    client
        .fetch(query)
        .then((result) => {
            mainCacheInnhold.set(mainCacheInnholdKey, result);
            backupCacheInnhold.set(backupCacheInnholdKey, result);
            res.send(sendDataObj(result));
        })
        .catch((error) => {
            checkbackupCacheInnhold(res, error);
        });
};

// sanity innhold
server.get(`${BASE_URL}/innhold/`, (req, res) => {
    setHeaders(res);
    const cacheInnhold = mainCacheInnhold.get(mainCacheInnholdKey);
    cacheInnhold ? res.send(sendDataObj(cacheInnhold)) : fetchInnhold(res);
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

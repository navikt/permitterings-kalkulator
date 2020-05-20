'use strict';
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
const fs = require('fs-extra');
const request = require('request');
const jsdom = require('jsdom');
const NodeCache = require('node-cache');
const sanityClient = require('@sanity/client');
// env

const server = express();
server.use(helmet());

const BASE_URL = '/arbeidsgiver-permittering';
const { JSDOM } = jsdom;
const prop = 'innerHTML';
const client = sanityClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

// Cache init
const mainCacheKey = 'permittering-withMenu';
const backupCacheKey = 'permittering-withMenuBackup';
const mainCacheInnholdKey = 'permittering-innhold';
const backupCacheInnholdKey = 'permittering-innholdBackup';
const mainCacheMeny = new NodeCache({ stdTTL: 900, checkperiod: 90 });
const backupCacheMeny = new NodeCache({ stdTTL: 0, checkperiod: 0 });
const mainCacheInnhold = new NodeCache({ stdTTL: 600, checkperiod: 60 });
const backupCacheInnhold = new NodeCache({ stdTTL: 0, checkperiod: 0 });

//server response to pipeline
server.get('/arbeidsgiver-permittering/internal/isAlive', (req, res) =>
    res.sendStatus(200)
);
server.get('/arbeidsgiver-permittering/internal/isReady', (req, res) =>
    res.sendStatus(200)
);

const sanityQueryTypes = () => [
    'hvordan-permittere-ansatte',
    'i-permitteringsperioden',
    'nar-skal-jeg-utbetale-lonn',
    'vanlige-sporsmal',
];

const htmlinsert = () => [
    { inject: 'styles', from: 'styles' },
    { inject: 'scripts', from: 'scripts' },
    { inject: 'headerWithmenu', from: 'header-withmenu' },
    { inject: 'footerWithmenu', from: 'footer-withmenu' },
    { inject: 'megamenuResources', from: 'megamenu-resources' },
];

const url = () =>
    process.env.DECORATOR_EXTERNAL_URL ||
    'https://www.nav.no/dekoratoren/?context=arbeidsgiver&redirectToApp=true&level=Level4/no/';

const querySanity = () =>
    `*[_type == '${sanityQueryTypes()[0]}' || _type == '${
        sanityQueryTypes()[1]
    }' || _type == '${sanityQueryTypes()[2]}' || _type == '${
        sanityQueryTypes()[3]
    }'] | order(_type, priority)`;

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
        console.log('cacheBackupInnhold', cacheBackupInnhold);
    } else {
        console.log('process env ', process.env);
        console.log('fetchError', fetchError);
        res.send(fetchError);
    }
};

const fetchInnhold = (res) => {
    const query = querySanity();
    client
        .fetch(query)
        .then((result) => {
            mainCacheInnhold.set(mainCacheInnholdKey, result);
            backupCacheInnhold.set(backupCacheInnholdKey, result);
            console.log('result', result);
            res.send(result);
        })
        .catch((error) => {
            checkbackupCacheInnhold(res, error);
        });
};

// sanity innhold
server.get(`${BASE_URL}/innhold/`, (req, res) => {
    setHeaders(res);
    const cacheInnhold = mainCacheInnhold.get(mainCacheInnholdKey);
    cacheInnhold ? res.send(cacheInnhold) : fetchInnhold(res);
});

const injectMenuIntoHtml = (menu) => {
    fs.readFile(__dirname + '/build/index.html', 'utf8', function (err, html) {
        if (!err) {
            const { document } = new JSDOM(html).window;
            htmlinsert().forEach((element) => {
                document.getElementById(element.inject)[
                    prop
                ] = menu.getElementById(element.from)[prop];
            });
            const output = document.documentElement.innerHTML;
            mainCacheMeny.set(mainCacheKey, output, 10000);
            backupCacheMeny.set(backupCacheKey, output, 0);
            serveAppWithMenu(output);
        } else {
            checkBackupCache();
        }
    });
};

const getMenu = () => {
    request({ method: 'GET', uri: url() }, (error, response, body) => {
        if (!error && response.statusCode >= 200 && response.statusCode < 400) {
            const { document } = new JSDOM(body).window;
            injectMenuIntoHtml(document);
        } else {
            console.log('tried to fetch menu fragments from ', `${url()}`);
            console.log('respons failed, with response ', response);
            console.log('error: ', error);
            checkBackupCache();
        }
    });
};

const serveAppWithMenu = (app) => {
    const staticPaths = [
        'asset-manifest.json',
        'manifest.json',
        'favicon.ico',
        'precache-manifest.*',
        'service-worker.js',
        'permittering.nav.illustrasjon.png',
        'static',
        'index.css',
    ];

    staticPaths.map((path) => serverUse(path));
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

const getMenuAndServeApp = () => {
    mainCacheMeny.get(mainCacheKey, (err, response) => {
        if (!err && response !== undefined) {
            serveAppWithMenu(response);
        } else {
            getMenu();
        }
    });
};

const checkBackupCache = () => {
    backupCacheMeny.get(backupCacheKey, (err, response) => {
        if (!err && response !== undefined) {
            mainCacheMeny.set(mainCacheKey, response, 10000);
            serveAppWithMenu(response);
        } else {
            console.log('failed to fetch menu');
            console.log(
                'cache store empty, serving app with out menu fragments'
            );
            serveAppWithOutMenu();
        }
    });
};

getMenuAndServeApp();

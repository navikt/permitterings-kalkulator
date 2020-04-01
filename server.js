'use strict';
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const fs = require('fs-extra');
const request = require('request');
const jsdom = require('jsdom');
const NodeCache = require('node-cache');

const server = express();
server.use(helmet());

const { JSDOM } = jsdom;
const prop = 'innerHTML';
const url =
    process.env.DECORATOR_EXTERNAL_URL ||
    'https://appres.nav.no/common-html/v4/navno?header-withmenu=true&styles=true&scripts=true&footer-withmenu=true';

const htmlinsert = [
    { inject: 'styles', from: 'styles' },
    { inject: 'scripts', from: 'scripts' },
    { inject: 'headerWithmenu', from: 'header-withmenu' },
    { inject: 'footerWithmenu', from: 'footer-withmenu' },
    { inject: 'megamenuResources', from: 'megamenu-resources' },
];

// Cache init
const mainCacheKey = 'tiltak-withMenu';
const backupCacheKey = 'tiltak-withMenuBackup';
const mainCache = new NodeCache({ stdTTL: 10000, checkperiod: 10020 });
const backupCache = new NodeCache({ stdTTL: 0, checkperiod: 0 });

server.get('/arbeidsgiver-permittering/internal/isAlive', (req, res) => res.sendStatus(200));
server.get('/arbeidsgiver-permittering/internal/isReady', (req, res) => res.sendStatus(200));

const injectMenuIntoHtml = (menu) => {
    fs.readFile(__dirname + '/build/index.html', 'utf8', function (err, html) {
        if (!err) {
            const { document } = new JSDOM(html).window;
            htmlinsert.forEach((element) => {
                document.getElementById(element.inject)[prop] = menu.getElementById(element.from)[prop];
            });
            const output = document.documentElement.innerHTML;
            mainCache.set(mainCacheKey, output, 10000);
            backupCache.set(backupCacheKey, output, 0);
            serveAppWithMenu(output);
        } else {
            checkBackupCache();
        }
    });
};

const getMenu = () => {
    request({ method: 'GET', uri: url }, (error, response, body) => {
        if (!error && response.statusCode >= 200 && response.statusCode < 400) {
            const { document } = new JSDOM(body).window;
            injectMenuIntoHtml(document);
        } else {
            console.log('tried to fetch menu fragments from ', `${url}`);
            console.log('respons failed, with response ', response);
            console.log('error: ', error);
            checkBackupCache();
        }
    });
};

const serveAppWithMenu = (app) => {
    server.use('/arbeidsgiver-permittering/static', express.static(path.join(__dirname, 'build/static')));
    server.use('/arbeidsgiver-permittering/index.css', express.static(path.join(__dirname, 'build/index.css')));
    server.get(['/arbeidsgiver-permittering/', '/arbeidsgiver-permittering/*'], (req, res) => {
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
    server.use('/arbeidsgiver-permittering', express.static(path.join(__dirname, 'build')));
    server.get('/arbeidsgiver-permittering/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    });
    setServerPort();
};

const getMenuAndServeApp = () => {
    mainCache.get(mainCacheKey, (err, response) => {
        if (!err && response !== undefined) {
            serveAppWithMenu(response);
        } else {
            getMenu();
        }
    });
};

const checkBackupCache = () => {
    backupCache.get(backupCacheKey, (err, response) => {
        if (!err && response !== undefined) {
            mainCache.set(mainCacheKey, response, 10000);
            serveAppWithMenu(response);
        } else {
            console.log('failed to fetch menu');
            console.log('cache store empty, serving app with out menu fragments');
            serveAppWithOutMenu();
        }
    });
};

getMenuAndServeApp();

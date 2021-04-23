require('console-stamp')(console, '[HH:MM:ss.l]');

const express = require('express');
const { getHtmlWithDecorator } = require('./decorator-utils');
const path = require('path');
const helmet = require('helmet');

const server = express();
const PORT = process.env.PORT || 3000;
const buildPath = path.join(__dirname, '../build');
const BASE_PATH = '/permittering-kalkulator';

const startServer = () => {
    server.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    connectSrc: [
                        "'self'",
                        'https://*.nav.no',
                        'https://*.psplugin.com',
                        'https://*.hotjar.com',
                        'https://www.google-analytics.com',
                    ],
                    defaultSrc: ["'none'"],
                    fontSrc: [
                        "'self'",
                        'data:',
                        'https://*.psplugin.com',
                        'http://*.psplugin.com',
                    ],
                    frameSrc: [
                        'https://player.vimeo.com',
                        'https://*.hotjar.com',
                    ],
                    imgSrc: [
                        "'self'",
                        'data:',
                        'https://*.nav.no',
                        'https://www.google-analytics.com',
                    ],
                    manifestSrc: ["'self'"],
                    scriptSrc: [
                        "'self'",
                        'https://*.nav.no',
                        'https://www.googletagmanager.com',
                        'https://www.google-analytics.com',
                        'https://*.hotjar.com',
                        'https://account.psplugin.com',
                        "'unsafe-inline'",
                        "'unsafe-eval'",
                    ],
                    styleSrc: ["'self'", 'https://*.nav.no', "'unsafe-inline'"],
                },
                reportOnly: true,
            },
        })
    );

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

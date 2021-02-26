const jsdom = require('jsdom');
const server = require('./server');
const template = require('./template');
const fs = require('fs-extra');
const NodeCache = require('node-cache');
const fetch = require('node-fetch');

const { JSDOM } = jsdom;
const prop = 'innerHTML';

// Cache init
const mainCacheKey = 'permittering-withMenu';
const backupCacheKey = 'permittering-withMenuBackup';
const mainCacheMeny = new NodeCache({ stdTTL: 900, checkperiod: 90 });
const backupCacheMeny = new NodeCache({ stdTTL: 0, checkperiod: 0 });

const injectMenuIntoHtml = (menu) => {
    fs.readFile(
        __dirname + '/../build/index.html',
        'utf8',
        function (err, html) {
            if (!err) {
                const { document } = new JSDOM(html).window;
                template.decoratorTemplatekeys().forEach((element) => {
                    document.getElementById(element.inject)[
                        prop
                    ] = menu.getElementById(element.from)[prop];
                });
                const output = document.documentElement.innerHTML;
                mainCacheMeny.set(mainCacheKey, output, 10000);
                backupCacheMeny.set(backupCacheKey, output, 0);
                server.serveAppWithMenu(output);
            } else {
                checkBackupCache();
            }
        }
    );
};

const getMenu = () => {
    fetch(template.url(), { method: 'GET' })
        .then((response) => response.text())
        .then((data) => {
            const { document } = new JSDOM(data).window;
            injectMenuIntoHtml(document);
        })
        .catch((err) => {
            console.log('tried to fetch menu fragments from ', template.url());
            console.log('respons failed, with response ', response);
            console.log('error: ', err);
            checkBackupCache();
        });
};

const getMenuAndServeApp = () => {
    console.log('Henter meny og starter app ...');
    mainCacheMeny.get(mainCacheKey, (err, response) => {
        if (!err && response !== undefined) {
            server.serveAppWithMenu(response);
        } else {
            getMenu();
        }
    });
};

const checkBackupCache = () => {
    backupCacheMeny.get(backupCacheKey, (err, response) => {
        if (!err && response !== undefined) {
            mainCacheMeny.set(mainCacheKey, response, 10000);
            server.serveAppWithMenu(response);
        } else {
            console.log('failed to fetch menu');
            console.log(
                'cache store empty, serving app with out menu fragments'
            );
            server.serveAppWithOutMenu();
        }
    });
};

module.exports.getMenu = getMenu;
module.exports.injectMenuIntoHtml = injectMenuIntoHtml;
module.exports.getMenuAndServeApp = getMenuAndServeApp;

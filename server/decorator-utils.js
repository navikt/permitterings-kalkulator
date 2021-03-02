const {
    injectDecoratorServerSide,
} = require('@navikt/nav-dekoratoren-moduler/ssr');

const decoratorConfig = {
    env: process.env.NAIS_CLUSTER_NAME === 'prod-sbs' ? 'prod' : 'dev',
};

const getHtmlWithDecorator = (filePath) =>
    injectDecoratorServerSide({
        filePath: filePath,
    });

module.exports = { getHtmlWithDecorator };

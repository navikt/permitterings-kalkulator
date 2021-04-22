const {
    injectDecoratorServerSide,
} = require('@navikt/nav-dekoratoren-moduler/ssr');

const decoratorConfig = {
    env: process.env.NAIS_CLUSTER_NAME === 'prod-gcp' ? 'prod' : 'dev',
    context: 'arbeidsgiver',
    language: 'nb',
};

console.log('Bruker dekoratør med følgende config: ', decoratorConfig);

const getHtmlWithDecorator = (filePath) =>
    injectDecoratorServerSide({
        ...decoratorConfig,
        filePath: filePath,
    });

module.exports = { getHtmlWithDecorator };

const {
    injectDecoratorServerSide,
} = require('@navikt/nav-dekoratoren-moduler/ssr');

const decoratorConfig = {
    env: process.env.NAIS_CLUSTER_NAME === 'prod-sbs' ? 'prod' : 'dev',
    context: 'arbeidsgiver',
    language: 'nb',
    breadcrumbs: [
        {
            url: 'https://arbeidsgiver.nav.no/arbeidsgiver-permittering',
            title: 'Veiviser for permittering',
        },
    ],
};

console.log('Bruker dekoratør med følgende config: ', decoratorConfig);

const getHtmlWithDecorator = (filePath) =>
    injectDecoratorServerSide({
        ...decoratorConfig,
        filePath: filePath,
    });

module.exports = { getHtmlWithDecorator };

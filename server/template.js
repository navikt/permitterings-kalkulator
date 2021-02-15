const uri =
    'https://www.nav.no/dekoratoren/?context=arbeidsgiver&redirectToApp=true&level=Level4&language=nb';
const breadcrumbs =
    '&breadcrumbs=[{"url":"https://arbeidsgiver.nav.no/arbeidsgiver-permittering","title":"Veiviser for permittering"}]';

const url = () => process.env.DECORATOR_EXTERNAL_URL || uri.concat(breadcrumbs);

const sanityQueryKeys = () => [
    'sist-oppdatert',
    'hvordan-permittere-ansatte',
    'nar-skal-jeg-utbetale-lonn',
    'i-permitteringsperioden',
    'vanlige-sporsmal',
];

const decoratorTemplatekeys = () => [
    { inject: 'styles', from: 'styles' },
    { inject: 'scripts', from: 'scripts' },
    { inject: 'headerWithmenu', from: 'header-withmenu' },
    { inject: 'footerWithmenu', from: 'footer-withmenu' },
    { inject: 'megamenuResources', from: 'megamenu-resources' },
];

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

const corsWhitelist = [
    '.nav.no',
    '.sanity.io',
    'http://localhost:',
    'amplitude.nav.no',
    'nav.',
];

module.exports.url = url;
module.exports.staticPaths = staticPaths;
module.exports.corsWhitelist = corsWhitelist;
module.exports.sanityQueryKeys = sanityQueryKeys;
module.exports.decoratorTemplatekeys = decoratorTemplatekeys;

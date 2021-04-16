const sanityClient = require('@sanity/client');
const NodeCache = require('node-cache');
const template = require('./template');

const client = sanityClient({
    projectId: process.env.SANITY_PROJECT_ID.trim(),
    dataset: process.env.SANITY_DATASET.trim(),
    token: process.env.SANITY_TOKEN.trim(),
    useCdn: false,
});

const mainCacheInnholdKey = 'permittering-innhold';
const backupCacheInnholdKey = 'permittering-innholdBackup';

const mainCacheInnhold = new NodeCache({
    stdTTL: parseInt(process.env.SANITY_CACHE_TTL),
    checkperiod: parseInt(process.env.SANITY_CACHE_CHECK),
});
const backupCacheInnhold = new NodeCache({ stdTTL: 0, checkperiod: 0 });

const sendDataObj = (json) => ({
    data: json,
    env: [process.env.SANITY_PROJECT_ID, process.env.SANITY_DATASET],
});

const sanityQuery = () =>
    template
        .sanityQueryKeys()
        .map((queryfragment, index) => {
            if (index === 0) {
                return `*[_type == '${queryfragment}' ||`;
            }
            return index === template.sanityQueryKeys().length - 1
                ? `_type == '${queryfragment}'] | order(_type, priority)`
                : `_type == '${queryfragment}' ||`;
        })
        .join(' ');

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

module.exports.fetchInnhold = fetchInnhold;
module.exports.mainCacheInnholdKey = mainCacheInnholdKey;
module.exports.mainCacheInnhold = mainCacheInnhold;

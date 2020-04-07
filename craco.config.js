const CracoLessPlugin = require('craco-less');
const decoratorhtmlwebpackplugin = require('./plugins/decoratorhtmlwebpackplugin');
const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src/'),
        },
    },
    plugins: [
        { plugin: CracoLessPlugin },
        {
            plugin: decoratorhtmlwebpackplugin(
                process.env.ENABLE_EXTERNAL_MENU
            ),
        },
    ],
};

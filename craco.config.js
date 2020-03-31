const CracoLessPlugin = require('craco-less');
const decoratorhtmlwebpackplugin = require('./plugins/decoratorhtmlwebpackplugin');

module.exports = {
    plugins: [
        { plugin: CracoLessPlugin },
        {
            plugin: decoratorhtmlwebpackplugin(process.env.ENABLE_EXTERNAL_MENU),
        },
    ],
};

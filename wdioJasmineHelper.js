const path = require('path');

const DEFAULT_OPTIONS = {
    configFile: path.resolve(__dirname, 'babel.config.js'),
    root: __dirname,
    rootMode: 'root',
    ignore: [],
    extensions: ['.js']
};

require('@babel/register')(DEFAULT_OPTIONS);

module.exports = function _jasminRegister() {
    require('@babel/register')(DEFAULT_OPTIONS);
};

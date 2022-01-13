/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const path = require('path');

const DEFAULT_OPTIONS = {
    configFile: path.resolve(__dirname, 'babel.config.js'),
    root: __dirname,
    rootMode: 'root',
    ignore: [],
    extensions: ['.js', '.ts']
};

require('@babel/register')(DEFAULT_OPTIONS);

module.exports = function _jasminRegister() {
    require('@babel/register')(DEFAULT_OPTIONS);
};

/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

module.exports = {
    // file masks for utam page objects
    pageObjectsFileMask: ['force-app/**/__utam__/**/*.utam.json'],
    // output folder for generated page objects, relative to the package root
    pageObjectsOutputDir: 'pageObjects',
    // remap custom elements imports
    alias: {
        'utam-sfdx/': 'ebikes-lwc/',
        'utam-*/': 'utam-preview/'
    }
};

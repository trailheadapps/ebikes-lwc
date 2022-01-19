/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

module.exports = {
    // file mask for utam page objects
    pageObjectsFileMask: ['src/**/*.utam.json'],
    // output folder for generated page objects, relative to the package root
    pageObjectsOutputDir: 'pageObjects',
    // remap custom elements imports
    alias: {
        'utam-*/': 'utam-preview/'
    }
};

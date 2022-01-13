/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

require('dotenv').config();

const path = require('path');
const { UtamWdioService } = require('wdio-utam-service');
// use prefix 'DEBUG=true' to run test in debug mode
const { DEBUG } = process.env;
const EXPLICIT_TIMEOUT = 60 * 1000;
const DEBUG_TIMEOUT = EXPLICIT_TIMEOUT * 30;

exports.config = {
    runner: 'local',
    specs: ['force-app/test/**/*.spec.js'],
    maxInstances: 1,
    capabilities: [
        {
            maxInstances: 1,
            browserName: 'chrome'
        }
    ],
    logLevel: 'debug',
    bail: 0,
    // timeout for all waitFor commands
    waitforTimeout: DEBUG ? DEBUG_TIMEOUT : EXPLICIT_TIMEOUT,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    automationProtocol: 'webdriver',
    services: ['chromedriver', [UtamWdioService, { implicitTimeout: 0 }]],
    framework: 'jasmine',
    reporters: ['spec'],
    jasmineNodeOpts: {
        // max execution time for a script, set to 5 min
        defaultTimeoutInterval: 1000 * 60 * 5,
        // Temporary workaround to get babel to work in wdio tests
        helpers: [path.resolve(process.cwd(), 'wdioJasmineHelper.js')]
    }
};

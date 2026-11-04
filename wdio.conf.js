require('dotenv').config();

const { UtamWdioService } = require('wdio-utam-service');
const { getScratchOrgLoginUrl } = require('./scripts/generate-login-url');
// use prefix 'DEBUG=true' to run test in debug mode
// CI is set by GitHub Actions, where Chrome runs headless
const { CI, DEBUG } = process.env;
const TIMEOUT = DEBUG ? 60 * 1000 * 30 : 60 * 1000;

exports.config = {
    runner: 'local',
    specs: ['force-app/test/**/*.spec.js'],
    maxInstances: 1,
    capabilities: [
        {
            maxInstances: 1,
            browserName: 'chrome',
            browserVersion: 'stable',
            // WebdriverIO v9 opens a WebDriver BiDi session unless told otherwise.
            // UTAM's element lookups expect classic WebDriver responses and fail
            // with BiDi (TypeError: elements.map is not a function), so force
            // the classic protocol.
            'wdio:enforceWebDriverClassic': true,
            'goog:chromeOptions': {
                args: [
                    '--disable-search-engine-choice-screen',
                    // run headless in CI, or locally with CI=true npm run test:ui
                    // --no-sandbox: Chrome's sandbox can't start on CI runners
                    // (restricted user namespaces); --disable-dev-shm-usage
                    // avoids crashes from a small /dev/shm
                    ...(CI
                        ? [
                              '--headless=new',
                              '--window-size=1920,1080',
                              '--no-sandbox',
                              '--disable-dev-shm-usage'
                          ]
                        : [])
                ]
            }
        }
    ],
    logLevel: 'debug',
    bail: 0,
    // timeout for all waitFor commands
    waitforTimeout: TIMEOUT,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    automationProtocol: 'webdriver',
    services: [
        [
            UtamWdioService,
            {
                implicitTimeout: 0,
                injectionConfigs: [
                    'salesforce-pageobjects/ui-global-components.config.json'
                ]
            }
        ]
    ],
    // The login url from the CLI works only once and every spec file runs in
    // its own browser session, so each session gets a fresh url
    beforeSession: async function () {
        process.env.SALESFORCE_LOGIN_URL = await getScratchOrgLoginUrl();
        process.env.SALESFORCE_LOGIN_TIME = `${new Date().getTime()}`;
    },
    framework: 'jasmine',
    reporters: ['spec'],
    jasmineOpts: {
        // max execution time for a script, set to 5 min
        defaultTimeoutInterval: 1000 * 60 * 5
    }
};

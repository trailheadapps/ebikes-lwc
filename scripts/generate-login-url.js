const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { writeFileSync } = require('fs');
const { join } = require('path');
const DOTENV_FILEPATH = join(__dirname, '../.env');

/**
 * Get the scratch org login url from a child CLI process and parse it
 * @returns {string} the scratch org url fetched from the getUrlCmd
 */
async function getScratchOrgLoginUrl() {
    const getUrlCmd = 'sf org open -p /lightning -r --json';
    console.log('Executing the following command: ', getUrlCmd);
    // The CLI also writes warnings to stderr (e.g. an available update), so
    // the JSON response on stdout decides whether the command worked
    const { stdout } = await exec(getUrlCmd, { cwd: __dirname });
    const response = JSON.parse(stdout);
    if (response.status !== 0 || !response.result?.url) {
        throw new Error(`Command failed: ${response.message ?? stdout}`);
    }
    // The url opens a session without a password, so it is never printed
    console.log('Command returned a login url');
    return response.result.url;
}

/**
 * Main script entry point - generate a property file with the correct salesforce login url:
 * 1. get the org login url
 * 2. overwrite property file with the url returned in step 1
 */
async function generateLoginUrl() {
    try {
        const url = await getScratchOrgLoginUrl();
        const template = `# DO NOT CHECK THIS FILE IN WITH PERSONAL INFORMATION SAVED
SALESFORCE_LOGIN_URL=${url}
SALESFORCE_LOGIN_TIME=${new Date().getTime()}`;
        writeFileSync(DOTENV_FILEPATH, template);
        console.log(
            `Property .env file successfully generated in ${DOTENV_FILEPATH}`
        );
    } catch (err) {
        console.error(err);
        // A failed run must not look successful and leave an old .env in place
        process.exitCode = 1;
    }
}

module.exports = { getScratchOrgLoginUrl };

// Run as a script (npm run test:ui:generate:login), not when wdio.conf.js imports it
if (require.main === module) {
    generateLoginUrl();
}

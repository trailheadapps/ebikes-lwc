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
    try {
        const getUrlCmd = 'sfdx force:org:open -p /lightning -r --json';
        console.log('Executing the following command: ', getUrlCmd);
        const { stderr, stdout } = await exec(getUrlCmd, { cwd: __dirname });
        if (stderr) throw new Error(stderr);
        const response = JSON.parse(stdout);
        const { url } = response.result;
        console.log(`Command returned with response: ${url}`);
        return url;
    } catch (err) {
        throw err;
    }
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
    }
}

generateLoginUrl();

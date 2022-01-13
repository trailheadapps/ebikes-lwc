/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { existsSync, readFileSync, writeFileSync } = require('fs');
const { parse } = require('envfile');
const {
    appendScratchOrgUrl,
    replaceScratchOrgUrl,
    getDefaultTemplate,
    DOTENV_FILEPATH,
    SCRATCH_ORG_KEY
} = require('./script-utils');

/**
 * Generate the content of the property file that should be written to disk
 *
 * @param {string} filePath path the default property file
 * @param {string} url scratch org login url to set in the property file
 * @returns {string} the property file with the updated url
 */
function createTemplateFromFile(filePath, url) {
    const envFile = readFileSync(filePath, { encoding: 'utf-8' });
    const parsedEnv = parse(envFile);
    const isScratchOrgKeyPresent =
        Object.keys(parsedEnv).includes(SCRATCH_ORG_KEY);
    const transformTemplateFn = !isScratchOrgKeyPresent
        ? appendScratchOrgUrl
        : replaceScratchOrgUrl;
    return transformTemplateFn(envFile, url).toString();
}

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
 * Main script entry point - generate a property file with the correct scratch org login url:
 *
 * 1. get the scratch org login url
 * 2. create or update the property file with the url returned in step 1
 */
async function generateLoginUrl() {
    try {
        const url = await getScratchOrgLoginUrl();
        const template = existsSync(DOTENV_FILEPATH)
            ? createTemplateFromFile(DOTENV_FILEPATH, url)
            : getDefaultTemplate(url);
        writeFileSync(DOTENV_FILEPATH, template);
        console.log(
            `Property .env file successfully generated in ${DOTENV_FILEPATH}`
        );
    } catch (err) {
        console.log(err);
    }
}

generateLoginUrl();

/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { join } = require('path');
const { parse, stringify } = require('envfile');
const MagicString = require('magic-string');

const SCRATCH_ORG_KEY = 'SCRATCH_ORG_LOGIN_URL';

const DOTENV_FILEPATH = join(__dirname, '../.env');

/**
 * Update the existing property file by appening the property for the scratch org login.
 * This function is called when the property file exists but doesn't have the
 * scratch org property setup
 *
 * @param {string} envFile content of the existing property file
 * @param {string} url scratch org login url to set in the property file
 * @returns {string} property file with the scratch org url property appened
 */
function appendScratchOrgUrl(envFile, url) {
    return new MagicString(envFile)
        .append('\n\n')
        .append(stringify({ SCRATCH_ORG_LOGIN_URL: url }));
}

/**
 * Update the existing property file by replacing the existing scratch org value.
 * This is used so that we don't overwrite the file and lose other configs any time
 * we need to generate a new login url
 *
 * @param {string} envFile content of the existing property file
 * @param {string} url scratch org login url to set in the property file
 * @returns {string} property file with the scratch org url updated
 */
function replaceScratchOrgUrl(envFile, url) {
    const parsedEnv = parse(envFile);
    const existingLoginUrl = parsedEnv[SCRATCH_ORG_KEY];
    const loginUrllocation = getLocationInFile(envFile, existingLoginUrl);
    const template = new MagicString(envFile);
    if (!loginUrllocation) {
        // scratch org url keys exits but no value, append the value
        const loginKeyLocation = getLocationInFile(envFile, SCRATCH_ORG_KEY, {
            isKey: true
        });
        return template.appendLeft(loginKeyLocation.end, url);
    }
    const { start, end } = loginUrllocation;
    return template.overwrite(start, end, url);
}

/**
 * Get the start and end indexes of the searchTerm in fileContent.
 * Note that the situation where the searchTerm isn't present is not handled by this function.
 * All call sites did explicitly check for the presence of the searchTerm in the file before calling
 * this function. If options.isKey is set to true, this function will look for the = sign as separator
 * and will return the position of the = sign on the current line.
 *
 * @param {string} fileContent content of the file in which we search for the substring
 * @param {string} searchTerm string being looking for in the file
 * @param {{isKey: boolean}} options set end to the separator (=) if isKey is set to true
 * @returns {({start: number, end: number}|null)}
 */
function getLocationInFile(fileContent, searchTerm, options) {
    if (!searchTerm) return null;
    const start = fileContent.lastIndexOf(searchTerm);
    let end = start + searchTerm.length;
    if (options && options.isKey) {
        while (fileContent.charAt(end) !== '=') {
            end++;
        }
        // add 1 for the  '=' character itself
        end += 1;
    }
    return { start, end };
}

/**
 * Generate default content for a property file that can be use to login in the scratch org
 *
 * @param {string} url scratch org login url to set in the property file
 * @returns {string} the content of the property file to write to disk
 */
function getDefaultTemplate(url = '') {
    return `# DO NOT CHECK THIS FILE IN WITH PERSONAL INFORMATION SAVED
#
# Environment variables required to run tests. Values here will be populated by
# running "node scripts/generate-login-url.js"
#
# Example:
# SCRATCH_ORG_LOGIN_URL=https://<scratch-org-name>.cs22.my.salesforce.com/secur/frontdoor.jsp?sid=<generated-sid>

SCRATCH_ORG_LOGIN_URL=${url}`;
}

module.exports = {
    SCRATCH_ORG_KEY,
    DOTENV_FILEPATH,
    appendScratchOrgUrl,
    replaceScratchOrgUrl,
    getDefaultTemplate
};

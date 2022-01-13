/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { writeFileSync } = require('fs');
const { getDefaultTemplate, DOTENV_FILEPATH } = require('./script-utils');

function createDotenvFile() {
    const template = getDefaultTemplate();
    writeFileSync(DOTENV_FILEPATH, template);
    console.log(
        `Property .env file successfully generated in ${DOTENV_FILEPATH}`
    );
}

createDotenvFile();

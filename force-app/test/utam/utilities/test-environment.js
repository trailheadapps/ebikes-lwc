/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/**
 * Utility class that reads test environment information from environment variables (process.env object).
 * You must create a .env file located at the project root that initializes the test environment variables.
 * For instance, assuming that the test environment prefix is "sandbox", the .env file should be set up like
 * this:
 *
 * SANDBOX_URL=https://sandbox.salesforce.com/
 * SANDBOX_USERNAME=my.user@salesforce.com
 * SANDBOX_PASSWORD=secretPassword
 * SANDBOX_REDIRECTION_URL=https://another.url.salesforce.com
 *
 * Only URL, USERNAME and PASSWORD are mandatory in the .env file. Make sure to separate the prefix and the property
 * name with underscores (i.e SANDBOX_URL).
 *
 * You can also use this class to write UI tests against a scratch org. To test against a scratch org,
 * make sure you .env file contains a property named SCRATCH_ORG_LOGIN_URL that holds the login URL value.
 * For instance, assuming that the test environment prefix is "myScratchOrg", the .env file should be set up like this:
 *
 * MY_SCRATCH_ORG_LOGIN_URL=https://orgdomain.salesforce.com/...
 *
 * When creating an instance of this class, pass the environment name prefix as a parameter to the constructor
 * (i.e new TestEnvironment("sandbox"))
 */
export class TestEnvironment {
    #envPrefix;
    #baseUrl;
    #redirectUrl;
    #username;
    #password;
    #sfdxLoginUrl;

    /**
     * Create a new test environment utility class
     * @param {string} envNamePrefix Test environment prefix
     */
    constructor(envNamePrefix) {
        this.#envPrefix = this.#camelCaseToUpperCase(envNamePrefix);
        this.#baseUrl = this.#getKeyFromEnv('url');
        this.#redirectUrl = this.#getKeyFromEnv('redirectUrl');
        this.#username = this.#getKeyFromEnv('username');
        this.#password = this.#getKeyFromEnv('password');
        this.#sfdxLoginUrl = this.#getKeyFromEnv('loginUrl');
    }

    /**
     * Read the value of a given key in environment variables
     * @param {string} keyName name of the key property as defined in the class constructor
     * @returns {string} the key value if found, otherwise the emtpy string
     */
    #getKeyFromEnv(keyName) {
        const key = `${this.#getEnvKeyName(keyName)}`;
        return process.env[key] || '';
    }

    /**
     * Transform a key name so that it matches environment variables format.
     * @param {string} keyName name of the key property as defined in the class constructor
     * @returns {string} the key that matches the property in environment variables
     */
    #getEnvKeyName(keyName) {
        return `${this.#envPrefix}_${this.#camelCaseToUpperCase(keyName)}`;
    }

    /**
     * Transform a camelCase string to uppercase separated by underscores
     * @param {string} keyName name of the key property as defined in the class constructor
     * @returns {string} return the key with the format that matches environment variables (without prefix)
     */
    #camelCaseToUpperCase(keyName) {
        return keyName
            .split(/(?=[A-Z])/)
            .join('_')
            .toUpperCase();
    }

    /**
     * Returns test environment base URL as specified in the .env file
     */
    get baseUrl() {
        if (!this.#baseUrl) {
            throw new Error(
                `Property ${this.#getEnvKeyName(
                    'url'
                )} is not set in '.env' property file`
            );
        }
        return this.#baseUrl;
    }

    /**
     * Returns test environment redirection URL as specified in the .env file
     */
    get redirectUrl() {
        if (!this.#redirectUrl) {
            return this.#baseUrl;
        }
        return this.#redirectUrl;
    }

    /**
     * Returns test environment username as specified in the .env file
     */
    get username() {
        if (!this.#username) {
            throw new Error(
                `Property ${this.#getEnvKeyName(
                    'username'
                )} is not set in '.env' property file`
            );
        }
        return this.#username;
    }

    /**
     * Returns test environment password as specified in the .env file
     */
    get password() {
        if (!this.#password) {
            throw new Error(
                `Property ${this.#getEnvKeyName(
                    'password'
                )} is not set in '.env' property file`
            );
        }
        return this.#password;
    }

    /**
     * Returns test environment login URL for scratch orgs
     */
    get sfdxLoginUrl() {
        if (!this.#sfdxLoginUrl) {
            throw new Error(
                `Property ${this.#getEnvKeyName(
                    'loginUrl'
                )} is not set in '.env' property file`
            );
        }
        return this.#sfdxLoginUrl;
    }
}

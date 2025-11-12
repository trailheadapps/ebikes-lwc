const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours by default

/**
 * Checks environment variables, session timeout and logs into Salesforce
 * @returns {DocumentUtamElement} the UTAM DOM handle
 */
export async function logInSalesforce() {
    // Check environment variables
    ['SALESFORCE_LOGIN_URL', 'SALESFORCE_LOGIN_TIME'].forEach((varName) => {
        if (!process.env[varName]) {
            throw new Error(`Missing ${varName} environment variable`);
        }
    });
    const { SALESFORCE_LOGIN_URL, SALESFORCE_LOGIN_TIME } = process.env;

    // Check for Salesforce session timeout
    if (
        new Date().getTime() - parseInt(SALESFORCE_LOGIN_TIME, 10) >
        SESSION_TIMEOUT
    ) {
        throw new Error(
            `Salesforce session timed out. Re-authenticate before running tests.`
        );
    }

    // Navigate to login URL
    await browser.navigateTo(SALESFORCE_LOGIN_URL);

    // Wait for home page URL
    const domDocument = utam.getCurrentDocument();
    await domDocument.waitFor(async () =>
        (await domDocument.getUrl()).endsWith('/home')
    );
    return domDocument;
}

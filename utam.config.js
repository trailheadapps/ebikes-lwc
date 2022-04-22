module.exports = {
    // file masks for utam page objects
    pageObjectsFileMask: ['force-app/**/__utam__/**/*.utam.json'],
    // remap custom elements imports
    alias: {
        'utam-sfdx/': 'ebikes-lwc/',
        'utam-lightning/': 'salesforce-pageobjects/lightning/',
        'utam-flexipage/': 'salesforce-pageobjects/flexipage/',
        'utam-global/': 'salesforce-pageobjects/global/'
    }
};

# E-Bikes Lightning Web Components Sample Application

[![CI Workflow](https://github.com/trailheadapps/ebikes-lwc/workflows/CI/badge.svg)](https://github.com/trailheadapps/ebikes-lwc/actions?query=workflow%3ACI) [![codecov](https://codecov.io/gh/trailheadapps/ebikes-lwc/branch/main/graph/badge.svg)](https://codecov.io/gh/trailheadapps/ebikes-lwc)

![ebikes-logo](ebikes-logo.png)

E-Bikes is a sample application that demonstrates how to build applications with Lightning Web Components and integrate with Salesforce Experiences. E-Bikes is a fictitious electric bicycle manufacturer. The application helps E-Bikes manage their products and reseller orders using a rich user experience.

<div>
    <img src="https://res.cloudinary.com/hy4kyit2a/f_auto,fl_lossy,q_70,w_50/learn/projects/quick-start-ebikes-sample-app/a11bf85d136053cdb4745123c4d0ae61_badge.png" align="left" alt="Trailhead Badge"/>
    Learn more about this app by completing the <a href="https://trailhead.salesforce.com/en/content/learn/projects/quick-start-ebikes-sample-app">Quick Start: Explore the E-Bikes Sample App</a> Trailhead project.
    <br/>
    <br/>
    <br/>
</div>

> This sample application is designed to run on Salesforce Platform. If you want to experience Lightning Web Components on any platform, please visit https://lwc.dev, and try out our Lightning Web Components sample application [LWC Recipes OSS](https://github.com/trailheadapps/lwc-recipes-oss).

## Table of contents

-   [Installing E-Bikes using a scratch org](#installing-e-bikes-using-a-scratch-org)
-   [Installing E-Bikes using a Developer Edition Org or a Trailhead Playground](#installing-e-bikes-using-a-developer-edition-org-or-a-trailhead-playground)
-   [Optional demo installation](#optional-demo-installation)
    -   [Pub Sub API demo](#pub-sub-api-demo)
-   [Optional tool installation](#optional-tool-installation)
    -   [Code formatting](#code-formatting)
    -   [Code linting](#code-linting)
    -   [Pre-commit hook](#pre-commit-hook)
    -   [Lightning Web Component tests](#lightning-web-component-tests)
    -   [UI tests with UTAM](#ui-tests)
    -   [Code Tours](#code-tours)

## Installing E-Bikes using a Scratch Org

1. Set up your environment. Follow the steps in the [Quick Start: Lightning Web Components](https://trailhead.salesforce.com/content/learn/projects/quick-start-lightning-web-components/) Trailhead project. The steps include:

    - Enable Dev Hub in your Trailhead Playground
    - Install Salesforce CLI
    - Install Visual Studio Code
    - Install the Visual Studio Code Salesforce extensions, including the Lightning Web Components extension

1. If you haven't already done so, authorize your hub org and provide it with an alias (**myhuborg** in the command below):

    ```
    sfdx auth:web:login -d -a myhuborg
    ```

1. Clone the repository:

    ```
    git clone https://github.com/trailheadapps/ebikes-lwc
    cd ebikes-lwc
    ```

1. Create a scratch org and provide it with an alias (**ebikes** in the command below):

    ```
    sfdx force:org:create -s -f config/project-scratch-def.json -a ebikes
    ```

1. Push the app to your scratch org:

    ```
    sfdx force:source:push
    ```

1. Assign the **ebikes** permission set to the default user:

    ```
    sfdx force:user:permset:assign -n ebikes
    ```

1. Assign the **Walkthroughs** permission set to the default user:

    ```
    sfdx force:user:permset:assign -n Walkthroughs
    ```

1. Import sample data:

    ```
    sfdx force:data:tree:import -p ./data/sample-data-plan.json
    ```

1. Publish the Experience Cloud site:

    ```
    sfdx force:community:publish -n E-Bikes
    ```

1. Deploy metadata for the Experience Cloud guest user profile:

    ```
    sfdx force:mdapi:deploy -d guest-profile-metadata -w 10
    ```

1. Open the scratch org:

    ```
    sfdx force:org:open
    ```

1. In **Setup**, under **Themes and Branding**, activate the **Lightning Lite** theme.

1. In App Launcher, select the **E-Bikes** app.

## Installing E-Bikes using a Developer Edition Org or a Trailhead Playground

Follow this set of instructions if you want to deploy the app to a more permanent environment than a Scratch org.
This includes non source-tracked orgs such as a [free Developer Edition Org](https://developer.salesforce.com/signup) or a [Trailhead Playground](https://trailhead.salesforce.com/).

Make sure to start from a brand-new environment to avoid conflicts with previous work you may have done.

1. Clone this repository:

    ```
    git clone https://github.com/trailheadapps/ebikes-lwc
    cd ebikes-lwc
    ```

1. Authorize your Trailhead Playground or Developer org and provide it with an alias (**mydevorg** in the command below):

    ```
    sfdx auth:web:login -s -a mydevorg
    ```

1. Enable Experiences with the following steps:

    1. In your org, in **Setup**, select **Settings**, under **Digital Experiences**.
    1. Click the **Enable Digital Experiences** checkbox
    1. Enter a domain name for your experience site. Remember this value as you’ll use it later in this step.
    1. Make sure that your domain name is available by clicking **Check Availability**.
    1. Click **Save** then **Ok**.
    1. Navigate back to **Settings** in Setup.
    1. Under **Experience Management Settings**, enable **Enable ExperienceBundle Metadata API**.

1. Configure the Experience Cloud site metadata file with the following steps:

    1. Edit the `force-app/main/default/sites/E_Bikes.site-meta.xml` file.
    1. Replace the value between the `<siteAdmin>` tags with your Playground username.
    1. Replace the value between the `<siteGuestRecordDefaultOwner>` tags with your Playground username.
    1. Replace the value between the `<subdomain>` tags with your domain.
    1. Save the file.

1. Remove the `Product` custom field from the `Case` object with the following steps:

    1. In Setup, click the **Object Manager** tab.
    1. Click on the **Case** object.
    1. Click **Fields & Relationships**.
    1. Locate the **Product** picklist field and click **Delete** from the row menu.
    1. Confirm deletion by clicking **Delete**.

1. Deploy the App with these steps:

    1. Run this command in a terminal to deploy the app.

        ```
        sfdx force:source:deploy -p force-app
        ```

    1. Assign the **ebikes** permission set to the default user.

        ```
        sfdx force:user:permset:assign -n ebikes
        ```

    1. Import some sample data.

        ```
        sfdx force:data:tree:import -p ./data/sample-data-plan.json
        ```

    1. Publish the Experience Cloud site.

        ```
        sfdx force:community:publish -n E-Bikes
        ```

    1. Deploy metadata for the Experience Cloud guest user profile:

        ```
        sfdx force:mdapi:deploy -d guest-profile-metadata -w 10
        ```

    1. If your org isn't already open, open it now:

        ```
        sfdx force:org:open
        ```

    1. In **Setup**, under **Themes and Branding**, activate the **Lightning Lite** theme.

    1. In App Launcher, select the **E-Bikes** app.

## Optional Demo Installation

### Pub Sub API Demo

After installing the E-Bikes Salesforce app, you can install an optional [ebikes-manufacturing](https://github.com/trailheadapps/ebikes-manufacturing) demo app. This demo is built with the Lightning Web Runtime and demonstrates the use of the Pub Sub API with Change Data Capture events and Platform Events.

## Optional Tool Installation

This repository contains several tools and scripts that are relevant if you want to integrate modern web development tooling to your Salesforce development processes, or to your continuous integration/continuous deployment processes.

To benefit from these developer tools, you must:

1. install a [Node.js LTS version](https://nodejs.org/en/)
1. install the Node project dependencies with by running `npm install` in a terminal.

For reference, the full list scripts and dependencies and can be found in [package.json](./package.json).

### Code Formatting

[Prettier](https://prettier.io/) is a code formatter used to ensure consistent formatting across your code base. The [.prettierignore](/.prettierignore) and [.prettierrc](/.prettierrc) files provided as part of this repository control the behavior of the Prettier formatter.

> **Warning**
> The current Apex Prettier plugin version requires that you install Java 11 or above.

To run Prettier from the command line, run `npm run prettier`.

To use Prettier with Visual Studio Code, install [this extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) from the Visual Studio Code Marketplace.

### Code Linting

[ESLint](https://eslint.org/) is a popular JavaScript linting tool used to identify stylistic errors and erroneous constructs. The [.eslintignore](/.eslintignore) file is provided as part of this repository to exclude specific files from the linting process in the context of Lightning Web Components development.

To run ESLint from the command line, run `npm run lint`.

To use ESLint with Visual Studio Code, install [this extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) from the Visual Studio Code Marketplace. The extension provides a code overlay that help you identify linting issues quickly.

### Pre-commit Hook

We use [Husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged) to set up a pre-commit hook that enforces code formatting and linting by running Prettier and ESLint every time you `git commit` changes.

Prettier and ESLint will automatically run every time you commit changes. The commit will fail if linting errors are detected in your changes.

### Lightning Web Component Tests

[Jest](https://jestjs.io/) is the testing library that we use to test our Lightning web components. More precisely, we use a [Jest wrapper library](https://github.com/salesforce/sfdx-lwc-jest) to run LWC tests. These tests are run on your local machine or in CI, not in Salesforce.

To run LWC tests from the command line, run `npm test`.

### UI Tests

We use [UTAM](utam.dev) with [WebdriverIO](https://webdriver.io/) to run UI tests on our app. Read [this blog post](https://developer.salesforce.com/blogs/2022/05/run-end-to-end-tests-with-the-ui-test-automation-model-utam) for a quick overview of this technology.

We run end-to-end tests on the Product Explorer page with `force-app/test/utam/page-explorer.spec.js`.

Follow these steps to run the UI tests manually:

1. Make sure that the Salesforce CLI is connected to an active org by running:
    ```sh
    sfdx force:org:open
    ```
1. Compile the UTAM page objects with this command:
    ```sh
    npm run test:ui:compile
    ```
1. Prepare login information for your UI tests with this command:
    ```sh
    npm run test:ui:generate:login
    ```
1. Run UI tests with this command:
    ```sh
    npm run test:ui
    ```

**Note:** if the test runner fails to open Chrome programmatically, update the `chromedriver` dependency to the latest version in `package.json` then, run `npm install` and `npm run test:ui` again.

### Code Tours

Code Tours are guided walkthroughs that will help you understand the app code better. To be able to run them, install the [CodeTour VSCode extension](https://marketplace.visualstudio.com/items?itemName=vsls-contrib.codetour).

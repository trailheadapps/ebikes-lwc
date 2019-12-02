# E-Bikes Lightning Web Components Sample Application

[![Github Workflow](<https://github.com/trailheadapps/ebikes-lwc/workflows/Salesforce%20DX%20CI%20(scratch%20org%20only)/badge.svg>)](https://github.com/trailheadapps/ebikes-lwc/actions)

![ebikes-logo](ebikes-logo.png)

E-Bikes is a sample application that demonstrates how to build applications with Lightning Web Components and integrate with Salesforce Communities. E-Bikes is a fictitious electric bicycle manufacturer. The application helps E-Bikes manage their products and reseller orders using a rich user experience.

> This sample application is designed to run on Salesforce Platform. If you want to experience Lightning Web Components on any platform, please visit https://lwc.dev, and try out our Lightning Web Components sample application [LWC Recipes OSS](https://github.com/trailheadapps/lwc-recipes-oss).

## Table of contents

-   [Installing E-Bikes using a scratch org](#installing-e-bikes-using-a-scratch-org)

-   [Installing E-Bikes using a Developer Edition Org](#installing-e-bikes-using-a-developer-edition-org)

-   [Optional installation instructions](#optional-installation-instructions)

-   [Salesforce Application Walkthrough](#salesforce-application-walkthrough)

-   [Communities Application Walkthrough](#communities-application-walkthrough)

## Installing E-Bikes using a Scratch Org

1. Set up your environment. Follow the steps in the [Quick Start: Lightning Web Components](https://trailhead.salesforce.com/content/learn/projects/quick-start-lightning-web-components/) Trailhead project. The steps include:

-   Enable Dev Hub in your Trailhead Playground
-   Install Salesforce CLI
-   Install Visual Studio Code
-   Install the Visual Studio Code Salesforce extensions, including the Lightning Web Components extension

2. If you haven't already done so, authenticate with your hub org and provide it with an alias (**myhuborg** in the command below):

```
sfdx force:auth:web:login -d -a myhuborg
```

3. Clone the repository:

```
git clone https://github.com/trailheadapps/ebikes-lwc
cd ebikes-lwc
```

4. Create a scratch org and provide it with an alias (**ebikes** in the command below):

```
sfdx force:org:create -s -f config/project-scratch-def.json -a ebikes
```

5. Push the app to your scratch org:

```
sfdx force:source:push
```

6. Assign the **ebikes** permission set to the default user:

```
sfdx force:user:permset:assign -n ebikes
```

7. Load sample data:

```
sfdx force:data:tree:import --plan ./data/sample-data-plan.json
```

8. Deploy Community metadata

```
sfdx force:mdapi:deploy -u ebikes --deploydir mdapiDeploy/unpackaged -w 5
```

9. Open the scratch org:

```
sfdx force:org:open
```

10. In **Setup**, under **Themes and Branding**, activate the **Lightning Lite** theme.

11. In **Setup**, select **All Communities**. Click on **Builder** for the _E-Bikes_ Community.

12. Click **Publish**, to publish the community. Click on the workspace icon in the top left corner, then click **View E-Bikes** to see the live community.

13. For experiencing the Salesforce app, open the App Launcher, and select the **E-Bikes** app.

## Installing E-Bikes using a Developer Edition Org

These steps assume you have followed the instructions above to install the application into a scratch org first, and now want to deploy it to a more permanent environment, including for completion of the [Lightning Web Components Basics Trailhead module](https://trailhead.salesforce.com/content/learn/modules/lightning-web-components-basics).

1. It's recommended to sign up for a [new Developer Edition org](https://developer.salesforce.com/signup), to avoid conflicts with work you may have done in any other orgs. If you created a new Developer Edition org to serve as a DevHub, and haven't done other work in the org, you can use that org.

2. Once you've logged in to the org, in **Setup**, under **My Domain**, [register a My Domain](https://help.salesforce.com/articleView?id=domain_name_setup.htm&type=5).

3. In **Setup**, under **Communities Settings**, click the **Enable communities** checkbox, and then select and register a subdomain for your community.

4. In **Setup**, under **Object Manager**, delete the custom **Product** picklist field from the **Case** object.

5. At the command line, authenticate to your Developer Edition, and provide it with an alias (**ebikesDE** in the command below):

```
sfdx force:auth:web:login -a ebikesDE
```

5. Check out a new branch of the code, to make changes that will allow deployment to a Developer Edition org:

```
git checkout -b devOrg
```

6. In VS Code, use the Ctrl/Cmd-P shortcut for Quick Open. Type **E_Bikes.site** and click on the **E_Bikes.site-meta.xml** file to open it.

7. Change the value in the **\<siteAdmin>** line to be your user name in the Developer Org, and change the value in the **\<subdomain>** line to be the subdomain you selected for your Communities (**codey<span>@</span>ebikes.dev** and **codeys-ebikes-developer-edition** in the example below). Save the file.

```
<siteAdmin>codey@ebikes.dev</siteAdmin>
<siteType>ChatterNetwork</siteType>
<subdomain>codeys-ebikes-developer-edition</subdomain>
```

8. Use Quick Open again to search for **Profile** and open **E-Bikes Profile.profile**. At the very end of the file, change the value in the **\<userLicense>** line to **Guest**. Save the file.

```
    <userLicense>Guest</userLicense>
</Profile>
```

9. Deploy the app to your Developer Edition org:

```
sfdx force:source:deploy -p force-app/main/default -u ebikesDE
```

10. Assign the **ebikes** permission set to the default user:

```
sfdx force:user:permset:assign -n ebikes -u ebikesDE
```

11. Load sample data:

```
sfdx force:data:tree:import --plan ./data/sample-data-plan.json -u ebikesDE
```

12. Open the Developer org:

```
sfdx force:org:open -u ebikesDE
```

13. In **Setup**, under **Themes and Branding**, activate the **Lightning Lite** theme.

14. In **Setup**, select **All Communities**. Click on **Builder** for the _E-Bikes_ Community.

15. Click **Publish**, to publish the community. Click on the workspace icon in the top left corner, then click **View E-Bikes** to see the live community.

16. For experiencing the Salesforce app, open the App Launcher, and select the **E-Bikes** app.

17. If you want to work with the application in a scratch org in the future, you'll want to switch back to the **master** branch:

```
git checkout master
```

## Optional Installation Instructions

This repository contains several files that are relevant if you want to integrate modern web development tooling to your Salesforce development processes, or to your continuous integration/continuous deployment processes.

### Code formatting

[Prettier](https://prettier.io/) is a code formatter used to ensure consistent formatting across your code base. To use Prettier with Visual Studio Code, install [this extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) from the Visual Studio Code Marketplace. The [.prettierignore](/.prettierignore) and [.prettierrc](/.prettierrc) files are provided as part of this repository to control the behavior of the Prettier formatter.

### Code linting

[ESLint](https://eslint.org/) is a popular JavaScript linting tool used to identify stylistic errors and erroneous constructs. To use ESLint with Visual Studio Code, install [this extension](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode-lwc) from the Visual Studio Code Marketplace. The [.eslintignore](/.eslintignore) file is provided as part of this repository to exclude specific files from the linting process in the context of Lighning Web Components development.

### Pre-commit hook

This repository also comes with a [package.json](./package.json) file that makes it easy to set up a pre-commit hook that enforces code formatting and linting by running Prettier and ESLint every time you `git commit` changes.

To set up the formatting and linting pre-commit hook:

1. Install [Node.js](https://nodejs.org) if you haven't already done so
2. Run `npm install` in your project's root folder to install the ESLint and Prettier modules (Note: Mac users should verify that Xcode command line tools are installed before running this command.)

Prettier and ESLint will now run automatically every time you commit changes. The commit will fail if linting errors are detected. You can also run the formatting and linting from the command line using the following commands (check out [package.json](./package.json) for the full list):

```
npm run lint:lwc
npm run prettier
```

## Salesforce Application Walkthrough

### Product Explorer

1. Click the **Product Explorer** tab.

2. Filter the list using the filter component in the left sidebar.

3. Click a product in the tile list to see the details in the product card.

4. Click the expand icon in the product card to navigate to the product record page.

### Product Record Page

1. The product record page features a **Similar Products** component.

2. Click the **View Details** button to navigate to a similar product record page.

### Reseller Orders

1. Click the down arrow on the **Reseller Order** tab and click **New Reseller Order**.

2. Select an account, for example **Wheelworks** and click **Save**.

3. Drag a product from the product list on the right onto the gray panel in the center. The product is automatically added to the order as an order item.

4. Modify the ordered quantity for small (S), medium (M), and large (L) frames and click the save button (checkmark icon).

5. Repeat steps 3 and 4 to add more products to the order.

6. Mouse over an order item tile and click the trash can icon to delete an order item from the order.

### Account Record Page

The account record page features an **Account Map** component that locates the account on a map.

## Communities Application Walkthrough

### Home

1. See the custom hero component in Communities that pulls in rich assets and navigates to the product or product family that is configured.

2. Check all the properties exposed in the hero component in Community Builder.

### Create Case

1. Select the _My Cases_ list view in the record list on the right side of the page.

2. Fill in the details of the case on the left side of the page.

3. Click on Create Case and see the record list to be updated with your new case.

### Product Explorer

1. Click the **Product Explorer** tab.

2. Filter the list using the filter component in the left sidebar.

3. Click a product in the tile list to see the details in the product card.

4. Click the expand icon in the product card to navigate to the product record page.

### Product Record Page

1. The product record page features a **Similar Products** component.

2. Click the **View Details** button to navigate to a similar product record page.

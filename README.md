# E-Bikes Lightning Web Components Sample Application

[![CircleCI](https://circleci.com/gh/trailheadapps/ebikes-lwc.svg?style=svg)](https://circleci.com/gh/trailheadapps/ebikes-lwc)

![ebikes-logo](ebikes-logo.png)

E-Bikes is a sample application that demonstrates how to build applications with Lightning Web Components. E-Bikes is a fictitious electric bicycle manufacturer. The application helps E-Bikes manage their products and reseller orders using a rich user experience.

## Table of contents

-   Installation Instructions

    -   [Installing E-Bikes using Salesforce DX](#installing-e-bikes-using-salesforce-dx)
    -   [Installing E-Bikes using an unlocked package](#installing-e-bikes-using-an-unlocked-package)

-   [Optional installation instructions](#optional-installation-instructions)

-   [Application Walkthrough](#application-walkthrough)

## Installation Instructions

There are two ways to install E-Bikes:

-   [Using Salesforce DX](#installing-e-bikes-using-salesforce-dx): This is the recommended installation option. Use this option if you are a developer who wants to experience the app and the code.
-   [Using an Unlocked Package](#installing-e-bikes-using-an-unlocked-package): This option allows anybody to experience the sample app without installing a local development environment.

## Installing E-Bikes using Salesforce DX

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

8. Open the scratch org:

```
sfdx force:org:open
```

9. In **Setup**, under **Themes and Branding**, activate the **Lightning Lite** theme.

10. In App Launcher, select the **E-Bikes** app.

## Installing E-Bikes using an Unlocked Package

1. [Sign up](https://developer.salesforce.com/signup) for a Developer Edition (DE) org.

2. Enable MyDomain in your DE org. Instructions to do this are [here](https://trailhead.salesforce.com/modules/identity_login/units/identity_login_my_domain).

3. Click [this link](https://login.salesforce.com/packaging/installPackage.apexp?p0=04tB0000000KAfOIAW) to install the E-Bikes unlocked package in your DE org.

4. Select **Install for All Users**

5. In **Setup**, under **Themes and Branding**, activate the **Lightning Lite** theme.

6. Import Account data:

-   Click [here](https://raw.githubusercontent.com/trailheadapps/ebikes-lwc/master/data/accounts.csv) to acccess the **accounts.csv** file. Right click in the browser window and save the file as **accounts.csv**.
-   In **Setup**, type **Data Import** in the Quick Find box and click **Data Import Wizard**.
-   Click **Launch Wizard**.
-   Click the **Standard objects** tab, click **Accounts and Contacts**, and click **Add new records**.
-   Drag the **accounts.csv** file you just saved and drop it in the upload area.
-   Click **Next**, **Next**, and **Start Import**.

7. Import Product Family data:

-   Click [here](https://raw.githubusercontent.com/trailheadapps/ebikes-lwc/master/data/product_families.csv) to acccess the **product_families.csv** file. Right click in the browser window and save the file as **product_families.csv**.
-   In **Setup**, type **Data Import** in the Quick Find box and click **Data Import Wizard**.
-   Click **Launch Wizard**.
-   Click the **Custom objects** tab, click **Product Families**, and click **Add new records**.
-   Drag the **product_families.csv** file you just saved and drop it in the upload area.
-   Click **Next**, **Next**, and **Start Import**.

8. Import Product data:

-   Click [here](https://raw.githubusercontent.com/trailheadapps/ebikes-lwc/master/data/products.csv) to acccess the **products.csv** file. Right click in the browser window and save the file as **products.csv**.
-   In **Setup**, type **Data Import** in the Quick Find box and click **Data Import Wizard**.
-   Click **Launch Wizard**.
-   Click the **Custom objects** tab, click **Products**, and click **Add new records**.
-   In the **Add new records** menu, under _Which Product Family field in your file do you want to match against to set the Product Family lookup field?_ select **Product Family Name** in the dropdown menu.
-   Drag the **products.csv** file you just saved and drop it in the upload area.
-   Click **Next**, **Next**, and **Start Import**.

9. In App Launcher, select the **E-Bikes** app.

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

## Application Walkthrough

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

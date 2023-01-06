/**
 * This file holds end-to-end tests for the Product Explorer page.
 * We use UTAM and WebdriverIO to run UI tests.
 */
import ProductFilter from '../../../pageObjects/productFilter';
import ProductTileList from '../../../pageObjects/productTileList';
import ProductCard from '../../../pageObjects/productCard';
import ProductExplorerPage from '../../../pageObjects/productExplorerPage';
import { logInSalesforce } from './utam-helper';

const PAGINATION_ALL_ITEMS = '16 items • page 1 of 2';
const PAGINATION_FILTERED_ITEMS = '4 items • page 1 of 1';
const SELECTION_EMPTY = 'Select a product to see details';

const RECORD_PAGE_URL = /lightning\/r\/Product__c\/[a-z0-9]{18}\/view/i;

describe('ProductExplorer', () => {
    let page;
    let domDocument;
    let productFilter, productTileList, productCard;

    beforeAll(async () => {
        domDocument = await logInSalesforce();
    });

    it('displays, filters and selects product from list', async () => {
        // Wait for home page to load
        page = await utam.load(ProductExplorerPage);

        // Click 'Product Explorer' in app navigation menu and wait for URL navigation
        const appNav = await page.getAppNav();
        const appNavBar = await appNav.getAppNavBar();
        const navItem = await appNavBar.getNavItem('Product Explorer');
        await navItem.clickAndWaitForUrl('lightning/n/Product_Explorer');

        // Wait for flexipage to load
        await page.waitForFlexipage();

        // Get page components from page template regions
        const leftComponent = await page.getLeftComponent();
        productFilter = await leftComponent.getContent(ProductFilter);
        const centerComponent = await page.getCenterComponent();
        productTileList = await centerComponent.getContent(ProductTileList);
        const rightComponent = await page.getRightComponent();
        productCard = await rightComponent.getContent(ProductCard);

        // Check default pagination info in product tile list
        const pageInfo = await productTileList.getPaginationInfo();
        expect(pageInfo).toBe(PAGINATION_ALL_ITEMS);

        // Check default empty selection in product card
        const productCardBodyText = await productCard.getBodyText();
        expect(productCardBodyText).toBe(SELECTION_EMPTY);

        // Enter search term
        const searchInput = await productFilter.getSearchInput();
        await searchInput.setText('fuse');

        // Wait for updated pagination info
        await productTileList.waitForPaginationUpdate(
            PAGINATION_FILTERED_ITEMS
        );

        // Select first product tile
        const productTiles = await productTileList.getTiles();
        await productTiles[0].click();

        // Wait for product selection
        await productCard.waitForSelectionUpdate('FUSE X1');

        // Open selected product record
        await productCard.clickOpenRecord();

        // Ensure that product record page is open
        await domDocument.waitFor(async () =>
            RECORD_PAGE_URL.test(await domDocument.getUrl())
        );
    });
});

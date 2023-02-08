/**
 * This file holds end-to-end tests for the Reseller Orders page.
 * We use UTAM and WebdriverIO to run UI tests.
 */
import { logInSalesforce } from './utam-helper';
import DesktopLayoutContainer from 'salesforce-pageobjects/navex/pageObjects/desktopLayoutContainer';
import ObjectHome from 'salesforce-pageobjects/force/pageObjects/objectHome';
import RecordActionWrapper from 'salesforce-pageobjects/global/pageObjects/recordActionWrapper';
import RecordField from 'salesforce-pageobjects/record/flexipage/pageObjects/recordField';
import RecordLayoutLookup from 'salesforce-pageobjects/records/pageObjects/recordLayoutLookup';
import RecordHomeTemplateDesktop from 'salesforce-pageobjects/global/pageObjects/recordHomeTemplateDesktop';
import FieldSection2 from 'salesforce-pageobjects/flexipage/pageObjects/fieldSection2';
import Column2 from 'salesforce-pageobjects/flexipage/pageObjects/column2';
import Tab2 from 'salesforce-pageobjects/flexipage/pageObjects/tab2';
import ProductTileList from '../../../pageObjects/productTileList';
import OrderBuilder from '../../../pageObjects/orderBuilder';
import OrderCreateForm from '../../../pageObjects/orderCreateForm';

const RECORD_PAGE_URL = /lightning\/r\/Order__c\/[a-z0-9]{18}\/view/i;

describe('ResellerOrders', () => {
    let domDocument;

    beforeAll(async () => {
        domDocument = await logInSalesforce();
    });

    it('creates a reseller order', async () => {
        // Click 'Product Explorer' in app navigation menu and wait for URL navigation
        const desktopContainer = await utam.load(DesktopLayoutContainer);
        const appNav = await desktopContainer.getAppNav();
        const appNavBar = await appNav.getAppNavBar();
        const appNavItem = await appNavBar.getNavItem('Reseller Orders');
        await appNavItem.clickAndWaitForUrl(
            '/lightning/o/Order__c/list?filterName=Recent'
        );

        // Create new order
        const objectHome = await utam.load(ObjectHome);
        const listView = await objectHome.getListView();
        const listViewHeader = await listView.getHeader();
        const listViewActions = await listViewHeader.getActions();
        const listViewActionLink = await listViewActions.getActionLink('New');
        await listViewActionLink.click();

        //await browser.debug();

        // Get create record modal
        /*
        const recActionWrapper = await utam.load(RecordActionWrapper);
        const recFormTemplate =
            await recActionWrapper.waitForRecordHomeSingleColNoHeaderTemplateDesktop2();
        let flexipageComponent = await recFormTemplate.getComponent2(
            'flexipage_fieldSection'
        );
        */
        const columns = await (
            await (
                await (
                    await (
                        await utam.load(RecordActionWrapper)
                    ).waitForRecordHomeSingleColNoHeaderTemplateDesktop2()
                ).getComponent2('flexipage_fieldSection')
            ).getContent(FieldSection2)
        ).getContent(Column2);

        console.log(`
        COLS: ${columns.length}
        `);

        await (
            await (
                await (
                    await (
                        await columns[0].getFieldByID('RecordAccount_cField')
                    ).getRecordFieldContent(RecordField)
                ).getFieldContentEditMode(RecordLayoutLookup)
            ).getLookup()
        ).getBaseCombobox();

        /*
        const createForm = await flexipageComponent.getContent(OrderCreateForm);
        

        console.log(JSON.stringify(createForm, null, 2));

        await createForm.getAccountField();
        
        //const accountField = await createForm.getAccountField();
        

        const section = await flexipageComponent.getContent(FieldSection2);
        const columns = await section.getContent(Column2);

        console.log(`
        
        ${columns.length}

        `);

        const recField = await columns[0].getFieldByID('RecordAccount_cField');
        const recFieldContent = await recField.getRecordFieldContent(
            RecordField
        );
        */

        /*
        //const recField = await genericComponent.getContent(RecordField);
        const recLookupLayout = await recFieldContent.getFieldContentEditMode(
            RecordLayoutLookup
        );

        //const createOrderModal = await recActionWrapper.getDetailsPanelContainer(RecordCreateModalForm);

        //const recForm = await recActionWrapper.getRecordForm();
        //await recForm.waitForLoad();

        // Select account
        /*
        const recLayout = await recForm.getRecordLayout();
        const recLayoutItem = await recLayout.getItem(1, 1, 1);
        const recLookupLayout = await recLayoutItem.getInputField(
            RecordLayoutLookup
        );

        const lookup = await recLookupLayout.getLookup();
        const lookupDesktop = await lookup.getLookupDesktop();
        const groupedCombobox = await lookupDesktop.getGroupedCombobox();
        const baseCombobox = await groupedCombobox.getBaseCombobox();
        await baseCombobox.setTriggerText('Trailblazers');
        await baseCombobox.waitForItemsToLoad();
        const items = await baseCombobox.getItems();
        expect(items.length).toBe(3);
        await items[1].clickItem();

        // Save record
        await recForm.clickFooterButton('Save');
        await recActionWrapper.waitForAbsence();

        // Ensure that order record page is open
        await domDocument.waitFor(async () =>
            RECORD_PAGE_URL.test(await domDocument.getUrl())
        );

        // Get order builder components
        const pageTemplate = await utam.load(RecordHomeTemplateDesktop);
        const tabSet = await pageTemplate.getTabset();
        const activeTab = await tabSet.getActiveTabContent(Tab2);
        let genericComponent = await activeTab.getComponent2('orderBuilder');
        const orderBuilder = await genericComponent.getContent(OrderBuilder);
        const orderBuilderDropzone = await orderBuilder.getDropZone();

        // Ensure that there are no items in the new order
        expect(await orderBuilder.getTotalItemsText()).toBe('Total Items: 0');

        // Get a draggable product tile
        const decorator = await pageTemplate.getDecorator();
        const subTemplate = await decorator.getTemplateDesktop2();
        genericComponent = await subTemplate.getComponent2('productTileList');
        const productTileList = await genericComponent.getContent(
            ProductTileList
        );
        const tiles = await productTileList.getTiles();
        expect(tiles.length).toBe(9);
        const draggableTile = await tiles[0].getDraggable();

        // Add product to order
        await draggableTile.dragAndDrop(orderBuilderDropzone, 1);

        // Ensure that the items were added to the order
        await orderBuilder.waitForTotalItemsText('Total Items: 3');
*/
    });
});

import { createElement } from 'lwc';
import OrderBuilder from 'c/orderBuilder';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getOrderItems from '@salesforce/apex/OrderController.getOrderItems';

// Mock realistic data for the getSimilarProducts adapter
const mockGetOrderItems = require('./data/getOrderItems.json');
//const mockGetOrderItemsEmpty = require('./data/getOrderItemsEmpty.json');
//const mockNewOrderItem = require('./data/newOrderItem.json');

// Mock realistic data for the public properties
const mockRecordId = '0031700000pHcf8AAC';
//const mockWireErrorMessage = 'Error retrieving records';

//Expected Wire Input
const WIRE_INPUT = {
    orderId: '0031700000pHcf8AAC'
};

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getOrderItemsAdapter = registerApexTestWireAdapter(getOrderItems);

describe('c-order-builder', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays the correct number of tiles and their details', () => {
        const element = createElement('c-order-builder', {
            is: OrderBuilder
        });
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit Data from the Apex wire adapter.s
        getOrderItemsAdapter.emit(mockGetOrderItems);

        return Promise.resolve().then(() => {
            // Check the wire parameters are correct
            expect(getOrderItemsAdapter.getLastConfig()).toEqual(WIRE_INPUT);
            // Select elements for validation
            const orderItemTileEl = element.shadowRoot.querySelectorAll(
                'c-order-item-tile'
            );
            expect(orderItemTileEl.length).toBe(mockGetOrderItems.length);
            // Get the map markers from mapEl to check that the location data has been populated
            const orderItem = orderItemTileEl[0].orderItem;
            expect(orderItem).toEqual(
                expect.objectContaining(mockGetOrderItems[0])
            );
            const formattedNumberEl = element.shadowRoot.querySelector(
                'lightning-formatted-number'
            );
            expect(formattedNumberEl.value).toBe(38880);
            const orderTotalDivEl = element.shadowRoot.querySelector(
                'div[class="right"]'
            );
            expect(orderTotalDivEl.textContent).toBe('Total Items: 9');
        });
    });

    /*
    it('updates the tiles when a new item has been dropped', () => {
        const element = createElement('c-order-builder', {
            is: OrderBuilder
        });
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit Data from the Apex wire adapter.s
        getOrderItemsAdapter.emit(mockGetOrderItems);

        return Promise.resolve().then(() => {
            // Check the wire parameters are correct
            expect(getOrderItemsAdapter.getLastConfig()).toEqual(WIRE_INPUT);
            // Select elements for validation
            const dropZoneDivEl = element.shadowRoot.querySelector(
                'div[class="drop-zone slds-p-around_x-small"]'
            );
            // Emulate a DragEvent, jsdom does not implement this class yet
            const dropEvent = new CustomEvent('drop');
            dropEvent.dataTransfer = {
                setData: 'product',
                mockNewOrderItem
            };
            document.body.appendChild(element);
            dropZoneDivEl.dispatchEvent(dropEvent);
            const orderItemTileEl = element.shadowRoot.querySelectorAll(
                'c-order-item-tile'
            );
            expect(orderItemTileEl.length).toBe(mockGetOrderItems.length);
            // Get the map markers from mapEl to check that the location data has been populated
            const orderItem = orderItemTileEl[0].orderItem;
            expect(orderItem).toEqual(
                expect.objectContaining(mockGetOrderItems[0])
            );
            const formattedNumberEl = element.shadowRoot.querySelector(
                'lightning-formatted-number'
            );
            expect(formattedNumberEl.value).toBe(38880);
            const orderTotalDivEl = element.shadowRoot.querySelector(
                'div[class="right"]'
            );
            expect(orderTotalDivEl.textContent).toBe('Total Items: 9');
        });
    });
    */
});

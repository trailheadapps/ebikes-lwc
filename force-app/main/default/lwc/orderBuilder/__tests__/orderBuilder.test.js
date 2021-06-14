import { createElement } from 'lwc';
import OrderBuilder from 'c/orderBuilder';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getOrderItems from '@salesforce/apex/OrderController.getOrderItems';

// Mock realistic data for the getOrderItems adapter
const mockGetOrderItems = require('./data/getOrderItems.json');
const mockGetOrderItemsEmpty = require('./data/getOrderItemsEmpty.json');

// Mock realistic data for the public properties
const mockRecordId = '0031700000pHcf8AAC';

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
        // Set values for validating component changes
        const expectedItems = 9;
        const expectedSum = 38880;

        const element = createElement('c-order-builder', {
            is: OrderBuilder
        });
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit Data from the Apex wire adapter.
        getOrderItemsAdapter.emit(mockGetOrderItems);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Check the wire parameters are correct
            expect(getOrderItemsAdapter.getLastConfig()).toEqual(WIRE_INPUT);
            // Select elements for validation
            const orderItemTileEl =
                element.shadowRoot.querySelectorAll('c-order-item-tile');
            expect(orderItemTileEl.length).toBe(mockGetOrderItems.length);
            // Get the order items to verify they have been set correctly
            const { orderItem } = orderItemTileEl[0];
            expect(orderItem).toEqual(
                expect.objectContaining(mockGetOrderItems[0])
            );
            // Get the formatted number to verify it has been calculated
            const formattedNumberEl = element.shadowRoot.querySelector(
                'lightning-formatted-number'
            );
            expect(formattedNumberEl.value).toBe(expectedSum);
            // Get the order total to verify it has been calculated
            const orderTotalDivEl =
                element.shadowRoot.querySelector('div.right');
            expect(orderTotalDivEl.textContent).toBe(
                `Total Items: ${expectedItems}`
            );
        });
    });

    it('updates the component when an order has been updated', () => {
        // Set values for validating component changes
        const mockRecordUpdate = { Id: 'a003B000004fG1VQAU', Qty_S__c: 3 };
        const expectedItems = 11;
        const expectedSum = 47280;

        const element = createElement('c-order-builder', {
            is: OrderBuilder
        });
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit Data from the Apex wire adapter.s
        getOrderItemsAdapter.emit(mockGetOrderItems);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve()
            .then(() => {
                // Check the wire parameters are correct
                expect(getOrderItemsAdapter.getLastConfig()).toEqual(
                    WIRE_INPUT
                );
                // Select elements for validation
                const orderItemTileEl =
                    element.shadowRoot.querySelectorAll('c-order-item-tile');
                orderItemTileEl[0].dispatchEvent(
                    new CustomEvent('orderitemchange', {
                        detail: mockRecordUpdate,
                        bubbles: true
                    })
                );
            })
            .then(() => {
                const orderItemTileEl =
                    element.shadowRoot.querySelectorAll('c-order-item-tile');
                // Get the first order item and check that the quantity has ben updated
                const orderItem = orderItemTileEl[0].orderItem.Qty_S__c;
                expect(orderItem).toEqual(mockRecordUpdate.Qty_S__c);
                // Get the formatted number to verify it has been updated
                const formattedNumberEl = element.shadowRoot.querySelector(
                    'lightning-formatted-number'
                );
                expect(formattedNumberEl.value).toBe(expectedSum);
                // Get the order total to verify it has been updated
                const orderTotalDivEl =
                    element.shadowRoot.querySelector('div.right');
                expect(orderTotalDivEl.textContent).toBe(
                    `Total Items: ${expectedItems}`
                );
            });
    });
    it('updates the component when an order has been deleted', () => {
        // Set values for validating component changes
        const mockRecordToDeleteId = 'a003B000004fG1VQAU';
        const expectedItems = 6;
        const expectedSum = 26280;

        const element = createElement('c-order-builder', {
            is: OrderBuilder
        });
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit Data from the Apex wire adapter.
        getOrderItemsAdapter.emit(mockGetOrderItems);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve()
            .then(() => {
                // Check the wire parameters are correct
                expect(getOrderItemsAdapter.getLastConfig()).toEqual(
                    WIRE_INPUT
                );
                // Select elements for validation
                const orderItemTileEl =
                    element.shadowRoot.querySelectorAll('c-order-item-tile');
                orderItemTileEl[0].dispatchEvent(
                    new CustomEvent('orderitemdelete', {
                        detail: { id: mockRecordToDeleteId }
                    })
                );
            })
            .then(() => {
                const orderItemTileEl =
                    element.shadowRoot.querySelectorAll('c-order-item-tile');
                // Get the first order item and check that the quantity has ben updated
                expect(orderItemTileEl.length).toBe(
                    mockGetOrderItems.length - 1
                );
                // Get the formatted number to verify it has been updated
                const formattedNumberEl = element.shadowRoot.querySelector(
                    'lightning-formatted-number'
                );
                expect(formattedNumberEl.value).toBe(expectedSum);
                // Get the order total to verify it has been updated
                const orderTotalDivEl =
                    element.shadowRoot.querySelector('div.right');
                expect(orderTotalDivEl.textContent).toBe(
                    `Total Items: ${expectedItems}`
                );
            });
    });

    it('displays a panel when no data is returned', () => {
        // Set values for validating component changes
        const expectedMessage = 'Drag products here to add items to the order';

        const element = createElement('c-order-builder', {
            is: OrderBuilder
        });
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit Data from the Apex wire adapter.
        getOrderItemsAdapter.emit(mockGetOrderItemsEmpty);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // verify that the placeholder is showing the correct data
            const placeholderEl =
                element.shadowRoot.querySelector('c-placeholder');
            expect(placeholderEl.message).toBe(expectedMessage);
        });
    });

    it('displays a error when an error is returned', () => {
        // Set values for validating component changes
        const mockError = { message: 'mockError' };

        const element = createElement('c-order-builder', {
            is: OrderBuilder
        });
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit Data from the Apex wire adapter.
        getOrderItemsAdapter.error(mockError);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Verify that the error panel is showing the correct data
            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
            expect(errorPanelEl.errors.body).toStrictEqual(mockError);
        });
    });

    it('is accessible when orders returned', () => {
        const element = createElement('c-order-builder', {
            is: OrderBuilder
        });
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit Data from the Apex wire adapter.
        getOrderItemsAdapter.emit(mockGetOrderItems);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when no orders returned', () => {
        const element = createElement('c-order-builder', {
            is: OrderBuilder
        });
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit Data from the Apex wire adapter.
        getOrderItemsAdapter.emit(mockGetOrderItemsEmpty);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when error returned', () => {
        const mockError = { message: 'mockError' };

        const element = createElement('c-order-builder', {
            is: OrderBuilder
        });
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit Error from the Apex wire adapter.
        getOrderItemsAdapter.error(mockError);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});

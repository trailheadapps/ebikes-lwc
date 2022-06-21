import { createElement } from 'lwc';
import OrderStatusPath from 'c/orderStatusPath';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { isEmpEnabled, onError, subscribe, empApiMock } from 'lightning/empApi';

// Mock realistic data
const mockGetObjectInfo = require('./data/getObjectInfo.json');
const mockGetPicklistValues = require('./data/getPicklistValues.json');
const mockGetRecord = require('./data/getRecord.json');
const mockEvent = {
    data: {
        payload: {
            Order_Id__c: undefined,
            Status__c: mockGetPicklistValues.values[3].value
        }
    }
};

describe('c-order-status-path', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();

        // Enable mock EMP API
        empApiMock.resetMock();
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    it('displays the path with the right items and selection', async () => {
        // Create initial element
        const element = createElement('c-order-status-path', {
            is: OrderStatusPath
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getObjectInfo.emit(mockGetObjectInfo);
        getPicklistValues.emit(mockGetPicklistValues);
        getRecord.emit(mockGetRecord);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check path items and values
        const pathItems = element.shadowRoot.querySelectorAll('li a');
        const pathItemValues = [];
        pathItems.forEach((pathItemElement) => {
            pathItemValues.push(pathItemElement.dataset.value);
        });
        const expectedValues = mockGetPicklistValues.values.map(
            (item) => item.value
        );
        expect(pathItemValues).toStrictEqual(expectedValues);

        // Check current selection
        const selectedItem = element.shadowRoot.querySelector(
            'li.slds-is-current a'
        );
        expect(selectedItem).not.toBeNull();
        expect(selectedItem.dataset.value).toBe(
            mockGetRecord.fields.Status__c.value
        );
    });

    it('changes status when path item is clicked', async () => {
        // Create initial element
        const element = createElement('c-order-status-path', {
            is: OrderStatusPath
        });
        document.body.appendChild(element);

        // Emit data from @wire
        getObjectInfo.emit(mockGetObjectInfo);
        getPicklistValues.emit(mockGetPicklistValues);
        getRecord.emit(mockGetRecord);

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Click on a path item
        const pathItems = element.shadowRoot.querySelectorAll('li a');
        pathItems[3].click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Validate updateRecord call
        expect(updateRecord).toHaveBeenCalled();
        expect(updateRecord.mock.calls[0][0].fields.Status__c).toEqual(
            mockGetPicklistValues.values[3].value
        );
    });

    it("displays an error when picklist values can't be retrieved", async () => {
        // Create initial element
        const element = createElement('c-order-status-path', {
            is: OrderStatusPath
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getPicklistValues.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check for error message
        const errorItem = element.shadowRoot.querySelector(
            '.slds-text-color_error'
        );
        expect(errorItem).not.toBeNull();
        expect(errorItem.textContent).toContain('picklist values');
    });

    it("displays an error when record data can't be retrieved", async () => {
        // Create initial element
        const element = createElement('c-order-status-path', {
            is: OrderStatusPath
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getRecord.error();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Check for error message
        const errorItem = element.shadowRoot.querySelector(
            '.slds-text-color_error'
        );
        expect(errorItem).not.toBeNull();
        expect(errorItem.textContent).toMatch(/record data/);
    });

    describe('empApi', () => {
        it('updates path when plaform event is received', async () => {
            // Create initial element
            const element = createElement('c-order-status-path', {
                is: OrderStatusPath
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getObjectInfo.emit(mockGetObjectInfo);
            getPicklistValues.emit(mockGetPicklistValues);
            getRecord.emit(mockGetRecord);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Validate EMP subscribe call
            expect(subscribe).toHaveBeenCalled();
            expect(subscribe.mock.calls[0][0]).toEqual(
                '/event/Manufacturing_Event__e'
            );
            expect(subscribe.mock.calls[0][1]).toEqual(-1);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Fire mock EMP API event
            empApiMock.fireMockEvent(mockEvent);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Validate updateRecord call
            expect(updateRecord).toHaveBeenCalled();
            expect(updateRecord.mock.calls[0][0].fields.Status__c).toEqual(
                mockGetPicklistValues.values[3].value
            );
        });

        it('displays an error when EMP API is disabled', async () => {
            // Disable mock EMP API
            empApiMock.setMockEmpEnabled(false);

            // Create initial element
            const element = createElement('c-order-status-path', {
                is: OrderStatusPath
            });
            document.body.appendChild(element);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Check for error message
            expect(isEmpEnabled).toHaveBeenCalled();
            const errorItem = element.shadowRoot.querySelector(
                '.slds-text-color_error'
            );
            expect(errorItem).not.toBeNull();
            expect(errorItem.textContent).toMatch(/EMP API/);
        });

        it('displays an error when EMP API reports an error', async () => {
            // Create initial element
            const element = createElement('c-order-status-path', {
                is: OrderStatusPath
            });
            document.body.appendChild(element);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Fire mock EMP API error
            empApiMock.fireMockError('mock error');

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Check for error message
            expect(onError).toHaveBeenCalled();
            const errorItem = element.shadowRoot.querySelector(
                '.slds-text-color_error'
            );
            expect(errorItem).not.toBeNull();
            expect(errorItem.textContent).toMatch('EMP API error: mock error');
        });

        it('displays an error when EMP API fails to subscribe', async () => {
            // Disable mock EMP API
            empApiMock.setMockSubscribeError('mock subscribe error');

            // Create initial element
            const element = createElement('c-order-status-path', {
                is: OrderStatusPath
            });
            document.body.appendChild(element);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Check for error message
            expect(subscribe).toHaveBeenCalled();
            const errorItem = element.shadowRoot.querySelector(
                '.slds-text-color_error'
            );
            expect(errorItem).not.toBeNull();
            expect(errorItem.textContent).toMatch(/failed to subscribe/);
        });
    });

    it('is accessible', async () => {
        const element = createElement('c-order-status-path', {
            is: OrderStatusPath
        });

        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });
});

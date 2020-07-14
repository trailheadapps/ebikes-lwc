import { createElement } from 'lwc';
import AccountMap from 'c/accountMap';
import { getRecord } from 'lightning/uiRecordApi';
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';

// Realistic data with an accounts address details
const mockGetRecord = require('./data/getRecord.json');

// Register as a LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getRecordAdapter = registerLdsTestWireAdapter(getRecord);
describe('c-account-map', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays a lightning-map when the wire adaptor returns records', () => {
        // Create element
        const element = createElement('c-account-map', {
            is: AccountMap
        });
        document.body.appendChild(element);

        // Emit data from the getRecord adapter.
        getRecordAdapter.emit(mockGetRecord);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Select elements for validation
            let mapEl = element.shadowRoot.querySelector('lightning-map');
            expect(mapEl.length).toBe(mockGetRecord.length);
        });
    });

    it('displays an error panel when the wire adaptor returns an empty array', () => {
        // Create element
        const element = createElement('c-account-map', {
            is: AccountMap
        });
        document.body.appendChild(element);

        // Emit an empty array from the getRecord adapter.
        getRecordAdapter.emit([]);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Select elements for validation
            let mapEl = element.shadowRoot.querySelector('lightning-map');
            expect(mapEl.length).toBe(mockGetRecord.length);
        });
    });

    it('displays an error panel when the Apex wire adaptor returns an error', () => {
        // Create element
        const element = createElement('c-account-map', {
            is: AccountMap
        });
        document.body.appendChild(element);

        // Emit an error from the getRecord adapter.
        getRecordAdapter.error();

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Select elements for validation
            const errorPanelEl = element.shadowRoot.querySelector(
                'c-error-panel'
            );
            expect(errorPanelEl).not.toBeNull();
        });
    });
});

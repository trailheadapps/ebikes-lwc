import { createElement } from 'lwc';
import AccountMap from 'c/accountMap';
import { getRecord } from 'lightning/uiRecordApi';
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';

// Realistic data with an accounts address details
const mockGetRecordWithAddress = require('./data/getRecordWithAddress.json');
const mockGetRecordWithoutAddress = require('./data/getRecordWithoutAddress.json');
const mockRecordId = '0031700000pJRRSAA4';
const mockWireErrorMessage = 'Error retrieving record';

// Register as a LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getRecordAdapter = registerLdsTestWireAdapter(getRecord);
describe('c-account-map', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays a lightning-map when wire adaptor returns an account record with billing street data', () => {
        // Create element
        const element = createElement('c-account-map', {
            is: AccountMap
        });
        // Set public properties
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit data from the get record adapter that includes billing street data
        getRecordAdapter.emit(mockGetRecordWithAddress);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Select elements for validation
            const mapEl = element.shadowRoot.querySelector('lightning-map');
            expect(mapEl).not.toBeNull();
            expect(mapEl.zoomLevel).toBe(14);

            // Get the map markers from mapEl to check that the location data has been populated
            const location = mapEl.mapMarkers[0].location;
            expect(location).toEqual(
                expect.objectContaining({
                    City: 'San Francisco',
                    Country: 'USA',
                    PostalCode: '94105',
                    State: 'California',
                    Street: '415 Mission St.'
                })
            );
        });
    });

    it('displays an error panel when the wire adaptor returns an empty array', () => {
        // Create element
        const element = createElement('c-account-map', {
            is: AccountMap
        });
        // Set public properties
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit data from the get record adapter that does not include billing street data
        getRecordAdapter.emit(mockGetRecordWithoutAddress);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Select elements for validation
            const mapEl = element.shadowRoot.querySelector('lightning-map');
            expect(mapEl).toBeNull();
            const errorPanelEl =
                element.shadowRoot.querySelector('c-error-panel');
            expect(errorPanelEl).not.toBeNull();
            expect(errorPanelEl.friendlyMessage).toBe('No address to map');
        });
    });

    it('displays an error panel when wire adapter returns an error', () => {
        // Create element
        const element = createElement('c-account-map', {
            is: AccountMap
        });
        // Set public properties
        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit an error from the getRecord adapter.
        getRecordAdapter.error(mockWireErrorMessage);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Select elements for validation
            const errorPanelEl =
                element.shadowRoot.querySelectorAll('c-error-panel');
            // There are two error panels in the component - we need the second to check
            // the wire errors are displaying correctly
            const errorPanel = errorPanelEl[1];
            expect(errorPanel).not.toBeNull();
            expect(errorPanel.errors.body).toBe(mockWireErrorMessage);
            expect(errorPanel.friendlyMessage).toBe(
                'Error retrieving map data'
            );
        });
    });

    it('is accessible when showing map', () => {
        const element = createElement('c-account-map', {
            is: AccountMap
        });

        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit data from the get record adapter that includes billing street data
        getRecordAdapter.emit(mockGetRecordWithAddress);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when showing error', () => {
        const element = createElement('c-account-map', {
            is: AccountMap
        });

        element.recordId = mockRecordId;
        document.body.appendChild(element);

        // Emit an error from the getRecord adapter.
        getRecordAdapter.error(mockWireErrorMessage);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});

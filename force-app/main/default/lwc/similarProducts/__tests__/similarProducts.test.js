import { createElement } from 'lwc';
import SimilarProducts from 'c/similarProducts';
import {
    registerLdsTestWireAdapter,
    registerApexTestWireAdapter
} from '@salesforce/sfdx-lwc-jest';
import { getRecord } from 'lightning/uiRecordApi';
import getSimilarProducts from '@salesforce/apex/ProductController.getSimilarProducts';

// Mock realistic data for the getRecord adapter
const mockGetRecord = require('./data/getRecord.json');

// Mock realistic data for the getSimilarProducts adapter
const mockSimilarProducts = require('./data/similarProducts.json');

// Mock empty data for the getSimilarProducts adapter
const mockSimilarProductsWithoutData = require('./data/similarProductsWithoutData.json');

// Mock realistic data for the public properties
const mockRecordId = '0031700000pHcf8AAC';
const mockFamilyId = '0069500000pGbk8DDC';
const mockWireErrorMessage = 'Error retrieving records';

//Expected Wire Input
const WIRE_INPUT = {
    fields: [
        {
            fieldApiName: 'Product_Family__c',
            objectApiName: 'Product__c'
        }
    ],
    recordId: '0031700000pHcf8AAC'
};

// Register as an LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getRecordAdapter = registerLdsTestWireAdapter(getRecord);

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getSimilarProductsListAdapter = registerApexTestWireAdapter(
    getSimilarProducts
);

describe('c-similar-products', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays a list of product tiles when the Apex wire adapter returns data', () => {
        const element = createElement('c-similar-products', {
            is: SimilarProducts
        });
        element.recordId = mockRecordId;
        element.familyId = mockFamilyId;
        document.body.appendChild(element);

        // Emit data from getRecord adapter
        getRecordAdapter.emit(mockGetRecord);

        // Emit Data from the Apex wire adapter.
        getSimilarProductsListAdapter.emit(mockSimilarProducts);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Check the wire parameters are correct
            expect(getRecordAdapter.getLastConfig()).toEqual(WIRE_INPUT);
            // Select elements for validation
            const productListItemEl = element.shadowRoot.querySelectorAll(
                'c-product-list-item'
            );
            expect(productListItemEl.length).toBe(mockSimilarProducts.length);
            expect(productListItemEl[0].product).toStrictEqual(
                mockSimilarProducts[0]
            );
        });
    });

    it('displays a placeholder when no similar products are returned', () => {
        const element = createElement('c-similar-products', {
            is: SimilarProducts
        });
        element.recordId = mockRecordId;
        element.familyId = mockFamilyId;
        document.body.appendChild(element);

        // Emit data from getRecord adapter
        getRecordAdapter.emit(mockGetRecord);

        // Emit an empty array from the Apex wire adapter.
        getSimilarProductsListAdapter.emit(mockSimilarProductsWithoutData);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Check the wire parameters are correct
            expect(getRecordAdapter.getLastConfig()).toEqual(WIRE_INPUT);
            // Select elements for validation
            const placeholderEl = element.shadowRoot.querySelector(
                'c-placeholder'
            );
            expect(placeholderEl).not.toBeNull();
        });
    });

    it('displays an error panel when the Apex wire adapter returns an error', () => {
        const element = createElement('c-similar-products', {
            is: SimilarProducts
        });
        element.recordId = mockRecordId;
        element.familyId = mockFamilyId;
        document.body.appendChild(element);

        // Emit data from getRecord adapter
        getRecordAdapter.emit(mockGetRecord);

        // Emit an error from the Apex wire adapter.
        getSimilarProductsListAdapter.error(mockWireErrorMessage);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.

        return Promise.resolve().then(() => {
            // Check the wire parameters are correct
            expect(getRecordAdapter.getLastConfig()).toEqual(WIRE_INPUT);
            // Select elements for validation
            const errorPanelEl = element.shadowRoot.querySelector(
                'c-error-panel'
            );
            expect(errorPanelEl).not.toBeNull();
            expect(errorPanelEl.errors[0].body).toBe(mockWireErrorMessage);
            expect(errorPanelEl.friendlyMessage).toBe(
                'An error has occurred while retrieving similar products'
            );
        });
    });

    it('is accessible', () => {
        const element = createElement('c-similar-products', {
            is: SimilarProducts
        });

        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            expect(element).toBeAccessible();
        });
    });
});
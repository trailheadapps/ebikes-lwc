import { createElement } from 'lwc';
import SimilarProducts from 'c/similarProducts';
import { getRecord } from 'lightning/uiRecordApi';
import {
    registerLdsTestWireAdapter,
    registerApexTestWireAdapter
} from '@salesforce/sfdx-lwc-jest';
import getSimilarProducts from '@salesforce/apex/ProductController.getSimilarProducts';

// Mock realistic data
const mockGetRecord = require('./data/getRecord.json');
const mockSimilarProducts = require('./data/similarProducts.json');

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
        document.body.appendChild(element);

        // Emit data from Lds @wire
        getRecordAdapter.emit(mockGetRecord);

        // Emit Data from the Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
        getSimilarProductsListAdapter.emit(mockSimilarProducts);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        //return flushPromises().then(() => {
        return Promise.resolve().then(() => {
            // Select elements for validation
            const productListItemEl = element.shadowRoot.querySelector(
                'c-product-list-item'
            );
            expect(productListItemEl).not.toBeNull();
        });
    });

    it('displays a placeholder when no similar products are returned', () => {
        const element = createElement('c-similar-products', {
            is: SimilarProducts
        });
        document.body.appendChild(element);

        // Emit data from Lds @wire
        getRecordAdapter.emit(mockGetRecord);

        // Emit Data from the Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
        getSimilarProductsListAdapter.emit([]);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        //return flushPromises().then(() => {
        return Promise.resolve().then(() => {
            // Select elements for validation
            const placeholderEl = element.shadowRoot.querySelector(
                'c-placeholder'
            );
            expect(placeholderEl).not.toBeNull();
        });
    });

    it('displays a n error panel when the Apex wire adaptor returns an error', () => {
        const element = createElement('c-similar-products', {
            is: SimilarProducts
        });
        document.body.appendChild(element);

        // Emit data from Lds @wire
        getRecordAdapter.emit(mockGetRecord);

        // Emit Data from the Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
        getSimilarProductsListAdapter.error();

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        //return flushPromises().then(() => {
        return Promise.resolve().then(() => {
            // Select elements for validation
            const errorPanelEl = element.shadowRoot.querySelector(
                'c-error-panel'
            );
            expect(errorPanelEl).not.toBeNull();
        });
    });
});

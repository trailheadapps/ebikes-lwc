import { createElement } from 'lwc';
import HeroDetails from 'c/heroDetails';
import getRecordInfo from '@salesforce/apex/ProductRecordInfoController.getRecordInfo';

// Mock realistic data for the getRecordInfo adapter
const mockGetRecordInfoProduct = require('./data/getRecordInfoProduct.json');
const mockGetRecordInfoProductFamily = require('./data/getRecordInfoProductFamily.json');

// Mock realistic data for the public properties
const mockTitle = 'Title';
const mockSlogan = 'Slogan';
const mockRecordName = 'Electra';

//Expected Wire Input
const WIRE_INPUT = {
    productOrFamilyName: 'Electra'
};

// Mock getRecordInfo Apex wire adapter
jest.mock(
    '@salesforce/apex/ProductRecordInfoController.getRecordInfo',
    () => {
        const {
            createApexTestWireAdapter
        } = require('@salesforce/sfdx-lwc-jest');
        return {
            default: createApexTestWireAdapter(jest.fn())
        };
    },
    { virtual: true }
);

describe('c-hero-details', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('sets the href URL to a Product__c', () => {
        const element = createElement('c-hero-details', {
            is: HeroDetails
        });
        element.recordName = mockRecordName;
        document.body.appendChild(element);

        // Emit Data from the Apex wire adapter.
        getRecordInfo.emit(mockGetRecordInfoProduct);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Check the wire parameters are correct
            expect(getRecordInfo.getLastConfig()).toEqual(WIRE_INPUT);
            // Select elements for validation
            const anchorEl = element.shadowRoot.querySelector('a');
            expect(anchorEl).not.toBeNull();
            expect(anchorEl.href).toBe(
                `http://localhost/product/${mockGetRecordInfoProduct[0]}`
            );
        });
    });

    it('sets the href URL to a Product_Family__c', () => {
        const element = createElement('c-hero-details', {
            is: HeroDetails
        });
        element.recordName = mockRecordName;
        document.body.appendChild(element);

        // Emit Data from the Apex wire adapter.
        getRecordInfo.emit(mockGetRecordInfoProductFamily);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Check the wire parameters are correct
            expect(getRecordInfo.getLastConfig()).toEqual(WIRE_INPUT);
            // Select elements for validation
            const anchorEl = element.shadowRoot.querySelector('a');
            expect(anchorEl).not.toBeNull();
            expect(anchorEl.href).toBe(
                `http://localhost/product-family/${mockGetRecordInfoProduct[0]}`
            );
        });
    });

    it('displays the title and slogan', () => {
        const element = createElement('c-hero-details', {
            is: HeroDetails
        });
        element.title = mockTitle;
        element.slogan = mockSlogan;
        element.recordName = mockRecordName;
        document.body.appendChild(element);

        // Emit Data from the Apex wire adapter.
        getRecordInfo.emit(mockGetRecordInfoProductFamily);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Check the wire parameters are correct
            expect(getRecordInfo.getLastConfig()).toEqual(WIRE_INPUT);
            // Select elements for validation
            const headingEL = element.shadowRoot.querySelector('h1');
            expect(headingEL.textContent).toBe(mockTitle);
            const paragraphEl = element.shadowRoot.querySelector('p');
            expect(paragraphEl.textContent).toBe(mockSlogan);
        });
    });

    it('is accessible', () => {
        const element = createElement('c-hero-details', {
            is: HeroDetails
        });

        element.title = mockTitle;
        element.slogan = mockSlogan;
        element.recordName = mockRecordName;
        document.body.appendChild(element);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});

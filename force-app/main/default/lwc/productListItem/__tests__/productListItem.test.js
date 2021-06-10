import { createElement } from 'lwc';
import ProductListItem from 'c/productListItem';
import { getNavigateCalledWith } from 'lightning/navigation';

describe('c-product-list-item', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('navigates to record page when View Details button clicked', () => {
        const expectedId = 'expectedId';
        const element = createElement('c-product-list-item', {
            is: ProductListItem
        });
        element.product = {
            Id: expectedId,
            Picture_URL__c: 'https://salesforce.com',
            Name: 'Foo',
            MSRP__c: 1000
        };
        document.body.appendChild(element);

        const lightningButton =
            element.shadowRoot.querySelector('lightning-button');
        lightningButton.click();

        const { pageReference } = getNavigateCalledWith();
        // Verify the component under test called the correct navigate event
        // type and sent the expected recordId defined above
        expect(pageReference.type).toBe('standard__recordPage');
        expect(pageReference.attributes.recordId).toBe(expectedId);
    });

    it('is accessible', () => {
        const element = createElement('c-product-list-item', {
            is: ProductListItem
        });

        element.product = {
            Id: 'expectedId',
            Picture_URL__c: 'https://salesforce.com',
            Name: 'Foo',
            MSRP__c: 1000
        };
        document.body.appendChild(element);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});

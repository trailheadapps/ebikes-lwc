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

    it('clicking View Details calls method to navigate to record page', () => {
        const expectedId = 'expectedId';
        const element = createElement('c-product-list-item', {
            is: ProductListItem,
        });
        const product = {
            Id: expectedId,
            Picture_URL__c: 'https://example.com',
            Name: 'Foo',
            MSRP__c: 1000,
        };
        element.product = product;
        document.body.appendChild(element);
        const lightningButton = element.shadowRoot.querySelector(
            'lightning-button',
        );

        lightningButton.click();

        const { pageReference } = getNavigateCalledWith();

        expect(pageReference.type).toBe('standard__recordPage');
        expect(pageReference.attributes.recordId).toBe(expectedId);
    });
});

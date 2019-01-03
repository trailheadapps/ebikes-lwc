import { createElement } from 'lwc';
import ProductListItem from 'c/productListItem';
import { NavigationMixin } from 'lightning/navigation';

describe('c-product-list-item', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('foo', () => {
        const element = createElement('c-product-list-item', {
            is: ProductListItem,
        });
        const product = {
            Id: 1,
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

        // TODO(tbliss): how to validate calls against the mixin?
        console.log('NavigationMixin: ', NavigationMixin);
    });
});

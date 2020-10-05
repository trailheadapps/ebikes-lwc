import { createElement } from 'lwc';
import ProductTile from 'c/productTile';

describe('c-product-tile', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('dragging sets product as dataTransfer data', () => {
        const element = createElement('c-product-tile', {
            is: ProductTile
        });
        // Emulate a DragEvent, jsdom does not implement this class yet
        const dragstartEvent = new CustomEvent('dragstart');
        dragstartEvent.dataTransfer = {
            setData: jest.fn()
        };
        const product = {
            Id: 1,
            Picture_URL__c: 'https://salesforce.com',
            Name: 'Foo',
            MSRP__c: 1000
        };
        element.product = product;
        document.body.appendChild(element);

        const div = element.shadowRoot.querySelector('div');
        div.dispatchEvent(dragstartEvent);

        expect(dragstartEvent.dataTransfer.setData).toHaveBeenCalledWith(
            'product',
            JSON.stringify(product)
        );
    });

    it('clicking fires selected event', () => {
        const listener = jest.fn();
        const element = createElement('c-product-tile', {
            is: ProductTile
        });
        element.addEventListener('selected', listener);
        element.product = {
            Id: 1,
            Picture_URL__c: 'https://salesforce.com',
            Name: 'Foo',
            MSRP__c: 1000
        };
        document.body.appendChild(element);

        const anchor = element.shadowRoot.querySelector('a');
        anchor.click();

        expect(listener).toHaveBeenCalled();
    });

    it('is accessible', () => {
        const element = createElement('c-product-tile', {
            is: ProductTile
        });

        element.product = {
            Id: 1,
            Picture_URL__c: 'https://salesforce.com',
            Name: 'Foo',
            MSRP__c: 1000
        };
        document.body.appendChild(element);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});

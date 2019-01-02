import { createElement } from 'lwc';
import ProductTileList from 'c/productTileList';
import {
    registerTestWireAdapter,
    registerLdsTestWireAdapter,
} from '@salesforce/wire-service-jest-util';
import getProducts from '@salesforce/apex/ProductController.getProducts';
import { CurrentPageReference } from 'lightning/navigation';

// Mock out the event firing function to verify it was called with expected parameters.
jest.mock('c/pubsub', () => {
    return {
        fireEvent: jest.fn(),
        registerListener: jest.fn(),
        unregisterAllListeners: jest.fn(),
    };
});

// TODO(tbliss): the default resolution for @salesforce/apex/foo.bar is a function that returns a resolved Promise.
//               that errors when it's used as an @wire id
jest.mock('@salesforce/apex/ProductController.getProducts', () => {
    return { default: jest.fn() };
}, { virtual: true });

const mockGetProductsValues = require('./data/getProducts.json');

// Register as an LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getProductsAdapter = registerLdsTestWireAdapter(getProducts);

// Register as a standard wire adapter because the component under test requires this adapter.
// We don't exercise this wire adpater in the tests.
registerTestWireAdapter(CurrentPageReference);

describe.only('c-product-tile-list', () => {

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    describe('c-paginator', () => {
        it('foo', () => {
            const element = createElement('c-product-tile-list', {
                is: ProductTileList,
            });
            getProductsAdapter.emit(mockGetProductsValues);

            document.body.appendChild(element);

            const paginator = element.shadowRoot.querySelector('c-paginator');
            expect(paginator).not.toBeNull();

            // expect(element).toMatchSnapshot();
        });
    });
});

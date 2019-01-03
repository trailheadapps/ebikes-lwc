import { createElement } from 'lwc';
import ProductTileList from 'c/productTileList';
import { fireEvent } from 'c/pubsub';
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
jest.mock(
    '@salesforce/apex/ProductController.getProducts',
    () => {
        return { default: jest.fn() };
    },
    { virtual: true },
);

const mockGetProducts = require('./data/getProducts.json');
const mockGetProductsNoRecords = require('./data/getProductsNoRecords.json');

// Register as an LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getProductsAdapter = registerLdsTestWireAdapter(getProducts);

// Register as a standard wire adapter because the component under test requires this adapter.
// We don't exercise this wire adpater in the tests.
registerTestWireAdapter(CurrentPageReference);

describe('c-product-tile-list', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    describe('with records', () => {
        it('renders paginator with correct item counts', () => {
            const element = createElement('c-product-tile-list', {
                is: ProductTileList,
            });
            document.body.appendChild(element);
            getProductsAdapter.emit(mockGetProducts);

            return Promise.resolve().then(() => {
                const paginator = element.shadowRoot.querySelector(
                    'c-paginator',
                );
                expect(paginator).not.toBeNull();

                // we know from the mock data (./data/getProducts.json) we
                // should have 12 total items and a page size of 9
                expect(paginator.shadowRoot.textContent).toMatch(
                    /12 items(.*)page 1 of 2/,
                );
            });
        });

        it('increments/decrements page number when "next" and "previous" events fired', () => {
            const element = createElement('c-product-tile-list', {
                is: ProductTileList,
            });
            document.body.appendChild(element);
            getProductsAdapter.emit(mockGetProducts);
            return Promise.resolve()
                .then(() => {
                    const paginator = element.shadowRoot.querySelector(
                        'c-paginator',
                    );
                    paginator.dispatchEvent(new CustomEvent('next'));
                })
                .then(() => {
                    // DOM is updated after event is fired so need to wait
                    // another microtask for the rerender
                    const paginator = element.shadowRoot.querySelector(
                        'c-paginator',
                    );
                    expect(paginator.shadowRoot.textContent).toMatch(
                        /page 2 of 2/,
                    );

                    paginator.dispatchEvent(new CustomEvent('previous'));
                })
                .then(() => {
                    const paginator = element.shadowRoot.querySelector(
                        'c-paginator',
                    );
                    expect(paginator.shadowRoot.textContent).toMatch(
                        /page 1 of 2/,
                    );
                });
        });

        it('displays one c-product-tile per record', () => {
            const recordCount = 9;
            const element = createElement('c-product-tile-list', {
                is: ProductTileList,
            });
            document.body.appendChild(element);
            getProductsAdapter.emit(mockGetProducts);
            return Promise.resolve().then(() => {
                const productTiles = element.shadowRoot.querySelectorAll(
                    'c-product-tile',
                );
                expect(productTiles).toHaveLength(recordCount);
            });
        });

        it('fires productSelected event when c-product-tile selected', () => {
            const element = createElement('c-product-tile-list', {
                is: ProductTileList,
            });
            document.body.appendChild(element);
            getProductsAdapter.emit(mockGetProducts);
            return Promise.resolve().then(() => {
                const productTile = element.shadowRoot.querySelector(
                    'c-product-tile',
                );
                productTile.dispatchEvent(new CustomEvent('selected'));
                expect(fireEvent).toHaveBeenCalledWith(
                    undefined,
                    'productSelected',
                    null,
                );
            });
        });
    });

    describe('without records', () => {
        it('does not render paginator', () => {
            const element = createElement('c-product-tile-list', {
                is: ProductTileList,
            });
            document.body.appendChild(element);
            getProductsAdapter.emit(mockGetProductsNoRecords);

            const paginator = element.shadowRoot.querySelector('c-paginator');
            expect(paginator).toBeNull();
        });

        it('renders placeholder with no products message', () => {
            const expected =
                'There are no products matching your current selection';
            const element = createElement('c-product-tile-list', {
                is: ProductTileList,
            });
            document.body.appendChild(element);
            getProductsAdapter.emit(mockGetProductsNoRecords);

            return Promise.resolve().then(() => {
                const placeholder = element.shadowRoot.querySelector(
                    'c-placeholder',
                );
                expect(placeholder.shadowRoot.textContent).toBe(expected);
            });
        });
    });

    describe('getProducts @wire error', () => {
        it('shows error message element', () => {
            const error = {
                details: {
                    body: {
                        message: 'error from test',
                    },
                },
            };
            const element = createElement('c-product-tile-list', {
                is: ProductTileList,
            });
            document.body.appendChild(element);
            getProductsAdapter.error(error);
            return Promise.resolve().then(() => {
                const inlineMessage = element.shadowRoot.querySelector(
                    'c-inline-message',
                );
                expect(inlineMessage).not.toBeNull();
            });
        });
    });

    // TODO(tbliss): how to verify search bar? filters is non-API and only connected to wire
    describe('with search bar visible', () => {
        it('renders lightning-input as search bar', () => {
            const element = createElement('c-product-tile-list', {
                is: ProductTileList,
            });
            element.searchBarIsVisible = true;
            document.body.appendChild(element);
            const searchBar = element.shadowRoot.querySelector('.search-bar');
            expect(searchBar.tagName.toLowerCase()).toBe('lightning-input');
        });
    });
});

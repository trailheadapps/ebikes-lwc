import { createElement } from 'lwc';
import ProductTileList from 'c/productTileList';
import { fireEvent } from 'c/pubsub';
import {
    registerTestWireAdapter,
    registerApexTestWireAdapter
} from '@salesforce/lwc-jest';
import getProducts from '@salesforce/apex/ProductController.getProducts';
import { CurrentPageReference } from 'lightning/navigation';

// Mock out the pubsub lib and use these mocks to verify how functions were called
jest.mock('c/pubsub', () => {
    return {
        fireEvent: jest.fn(),
        registerListener: jest.fn(),
        unregisterAllListeners: jest.fn()
    };
});

// Realistic data with multiple records
const mockGetProducts = require('./data/getProducts.json');
// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockGetProductsNoRecords = require('./data/getProductsNoRecords.json');

// Register the Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getProductsAdapter = registerApexTestWireAdapter(getProducts);

// Register as a standard wire adapter because the component under test requires this adapter.
// We don't exercise this wire adapter in the tests.
registerTestWireAdapter(CurrentPageReference);

describe('c-product-tile-list', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    describe('getProduct @wire emits records', () => {
        it('renders paginator with correct item counts', () => {
            const element = createElement('c-product-tile-list', {
                is: ProductTileList
            });
            document.body.appendChild(element);
            getProductsAdapter.emit(mockGetProducts);

            // Return a promise to wait for any asynchronous DOM updates.
            return Promise.resolve().then(() => {
                const paginator = element.shadowRoot.querySelector(
                    'c-paginator'
                );
                expect(paginator).not.toBeNull();

                // paginator text will look something like: "12 items • page 1 of 2"
                const totalPages = Math.ceil(
                    mockGetProducts.totalItemCount / mockGetProducts.pageSize
                );
                const regex = new RegExp(
                    `${mockGetProducts.totalItemCount} items(.*)page ${
                        mockGetProducts.pageNumber
                    } of ${totalPages}`
                );
                expect(paginator.shadowRoot.textContent).toMatch(regex);
            });
        });

        it('increments/decrements page number when "next" and "previous" events fired', () => {
            const totalPages = Math.ceil(
                mockGetProducts.totalItemCount / mockGetProducts.pageSize
            );
            const element = createElement('c-product-tile-list', {
                is: ProductTileList
            });
            document.body.appendChild(element);
            getProductsAdapter.emit(mockGetProducts);

            return Promise.resolve()
                .then(() => {
                    const paginator = element.shadowRoot.querySelector(
                        'c-paginator'
                    );
                    paginator.dispatchEvent(new CustomEvent('next'));
                })
                .then(() => {
                    // DOM is updated after event is fired so need to wait
                    // another microtask for the rerender
                    const paginator = element.shadowRoot.querySelector(
                        'c-paginator'
                    );
                    const currentPage =
                        parseInt(mockGetProducts.pageNumber, 10) + 1;
                    const regex = new RegExp(
                        `page ${currentPage} of ${totalPages}$`
                    );
                    expect(paginator.shadowRoot.textContent).toMatch(regex);

                    paginator.dispatchEvent(new CustomEvent('previous'));
                })
                .then(() => {
                    const paginator = element.shadowRoot.querySelector(
                        'c-paginator'
                    );
                    // we're back to the original page number now
                    const regex = new RegExp(
                        `page ${mockGetProducts.pageNumber} of ${totalPages}$`
                    );
                    expect(paginator.shadowRoot.textContent).toMatch(regex);
                });
        });

        it('updates getProducts @wire with new pageNumber', () => {
            const element = createElement('c-product-tile-list', {
                is: ProductTileList
            });
            document.body.appendChild(element);
            getProductsAdapter.emit(mockGetProducts);

            // Return a promise to wait for any asynchronous DOM updates.
            return Promise.resolve()
                .then(() => {
                    const paginator = element.shadowRoot.querySelector(
                        'c-paginator'
                    );
                    paginator.dispatchEvent(new CustomEvent('next'));
                })
                .then(() => {
                    const { pageNumber } = getProductsAdapter.getLastConfig();
                    // we've fired a single 'next' event so increment the original pageNumber
                    expect(pageNumber).toBe(mockGetProducts.pageNumber + 1);
                });
        });

        it('displays one c-product-tile per record', () => {
            const recordCount = mockGetProducts.records.length;
            const element = createElement('c-product-tile-list', {
                is: ProductTileList
            });
            document.body.appendChild(element);
            getProductsAdapter.emit(mockGetProducts);

            return Promise.resolve().then(() => {
                const productTiles = element.shadowRoot.querySelectorAll(
                    'c-product-tile'
                );
                expect(productTiles).toHaveLength(recordCount);
            });
        });

        it('fires productSelected event when c-product-tile selected', () => {
            const element = createElement('c-product-tile-list', {
                is: ProductTileList
            });
            document.body.appendChild(element);
            getProductsAdapter.emit(mockGetProducts);

            return Promise.resolve().then(() => {
                const productTile = element.shadowRoot.querySelector(
                    'c-product-tile'
                );
                productTile.dispatchEvent(new CustomEvent('selected'));
                expect(fireEvent).toHaveBeenCalledWith(
                    undefined,
                    'productSelected',
                    null
                );
            });
        });
    });

    describe('getProduct @wire emits empty list of records', () => {
        it('does not render paginator', () => {
            const element = createElement('c-product-tile-list', {
                is: ProductTileList
            });
            document.body.appendChild(element);
            getProductsAdapter.emit(mockGetProductsNoRecords);

            return Promise.resolve().then(() => {
                const paginator = element.shadowRoot.querySelector(
                    'c-paginator'
                );
                expect(paginator).toBeNull();
            });
        });

        it('renders placeholder with no products message', () => {
            const expected =
                'There are no products matching your current selection';
            const element = createElement('c-product-tile-list', {
                is: ProductTileList
            });
            document.body.appendChild(element);
            getProductsAdapter.emit(mockGetProductsNoRecords);

            return Promise.resolve().then(() => {
                const placeholder = element.shadowRoot.querySelector(
                    'c-placeholder'
                );
                expect(placeholder.shadowRoot.textContent).toBe(expected);
            });
        });
    });

    describe('getProducts @wire error', () => {
        it('shows error message element with error details populated', () => {
            // This is the default error message that gets emitted from apex
            // adapters. See @salesforce/wire-service-jest-util for the source.
            const defaultError = 'An internal server error has occurred';
            const element = createElement('c-product-tile-list', {
                is: ProductTileList
            });
            document.body.appendChild(element);
            getProductsAdapter.error();
            return Promise.resolve()
                .then(() => {
                    const inlineMessage = element.shadowRoot.querySelector(
                        'c-inline-message'
                    );
                    // check the "Show Details" checkbox to render additional error messages
                    const lightningInput = inlineMessage.shadowRoot.querySelector(
                        'lightning-input'
                    );
                    lightningInput.checked = true;
                    lightningInput.dispatchEvent(new CustomEvent('change'));
                })
                .then(() => {
                    const inlineMessage = element.shadowRoot.querySelector(
                        'c-inline-message'
                    );
                    const text = inlineMessage.shadowRoot.textContent;
                    expect(text).toContain(defaultError);
                });
        });
    });

    describe('with search bar visible', () => {
        it('updates getProducts @wire with searchKey as filter when search bar changes', () => {
            const searchKey = 'foo';
            const expected = JSON.stringify({ searchKey });
            const element = createElement('c-product-tile-list', {
                is: ProductTileList
            });
            element.searchBarIsVisible = true;
            document.body.appendChild(element);
            getProductsAdapter.emit(mockGetProducts);

            return Promise.resolve()
                .then(() => {
                    const searchBar = element.shadowRoot.querySelector(
                        '.search-bar'
                    );
                    searchBar.value = searchKey;
                    searchBar.dispatchEvent(new CustomEvent('change'));
                })
                .then(() => {
                    const { filters } = getProductsAdapter.getLastConfig();
                    expect(filters).toBe(expected);
                });
        });
    });
});

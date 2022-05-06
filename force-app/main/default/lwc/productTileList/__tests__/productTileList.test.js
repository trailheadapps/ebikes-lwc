import { createElement } from 'lwc';
import ProductTileList from 'c/productTileList';
import { publish } from 'lightning/messageService';
import PRODUCTS_FILTERED_MESSAGE from '@salesforce/messageChannel/ProductsFiltered__c';
import PRODUCT_SELECTED_MESSAGE from '@salesforce/messageChannel/ProductSelected__c';
import getProducts from '@salesforce/apex/ProductController.getProducts';

// Realistic data with multiple records
const mockGetProducts = require('./data/getProducts.json');
// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockGetProductsNoRecords = require('./data/getProductsNoRecords.json');

// Mock getContactList Apex wire adapter
jest.mock(
    '@salesforce/apex/ProductController.getProducts',
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
            getProducts.emit(mockGetProducts);

            // Return a promise to wait for any asynchronous DOM updates.
            return Promise.resolve().then(() => {
                const paginator =
                    element.shadowRoot.querySelector('c-paginator');
                expect(paginator).not.toBeNull();

                // paginator text will look something like: "12 items • page 1 of 2"
                const totalPages = Math.ceil(
                    mockGetProducts.totalItemCount / mockGetProducts.pageSize
                );
                const regex = new RegExp(
                    `${mockGetProducts.totalItemCount} items(.*)page ${mockGetProducts.pageNumber} of ${totalPages}`
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
            getProducts.emit(mockGetProducts);

            return Promise.resolve()
                .then(() => {
                    const paginator =
                        element.shadowRoot.querySelector('c-paginator');
                    paginator.dispatchEvent(new CustomEvent('next'));
                })
                .then(() => {
                    // DOM is updated after event is fired so need to wait
                    // another microtask for the rerender
                    const paginator =
                        element.shadowRoot.querySelector('c-paginator');
                    const currentPage =
                        parseInt(mockGetProducts.pageNumber, 10) + 1;
                    const regex = new RegExp(
                        `page ${currentPage} of ${totalPages}$`
                    );
                    expect(paginator.shadowRoot.textContent).toMatch(regex);

                    paginator.dispatchEvent(new CustomEvent('previous'));
                })
                .then(() => {
                    const paginator =
                        element.shadowRoot.querySelector('c-paginator');
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
            getProducts.emit(mockGetProducts);

            // Return a promise to wait for any asynchronous DOM updates.
            return Promise.resolve()
                .then(() => {
                    const paginator =
                        element.shadowRoot.querySelector('c-paginator');
                    paginator.dispatchEvent(new CustomEvent('next'));
                })
                .then(() => {
                    const { pageNumber } = getProducts.getLastConfig();
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
            getProducts.emit(mockGetProducts);

            return Promise.resolve().then(() => {
                const productTiles =
                    element.shadowRoot.querySelectorAll('c-product-tile');
                expect(productTiles).toHaveLength(recordCount);
            });
        });

        it('sends productSelected event when c-product-tile selected', () => {
            const element = createElement('c-product-tile-list', {
                is: ProductTileList
            });
            document.body.appendChild(element);
            getProducts.emit(mockGetProducts);

            return Promise.resolve().then(() => {
                const productTile =
                    element.shadowRoot.querySelector('c-product-tile');
                productTile.dispatchEvent(new CustomEvent('selected'));
                expect(publish).toHaveBeenCalledWith(
                    undefined,
                    PRODUCT_SELECTED_MESSAGE,
                    { productId: null }
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
            getProducts.emit(mockGetProductsNoRecords);

            return Promise.resolve().then(() => {
                const paginator =
                    element.shadowRoot.querySelector('c-paginator');
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
            getProducts.emit(mockGetProductsNoRecords);

            return Promise.resolve().then(() => {
                const placeholder =
                    element.shadowRoot.querySelector('c-placeholder');
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
            getProducts.error();
            return Promise.resolve()
                .then(() => {
                    const errorPanel =
                        element.shadowRoot.querySelector('c-error-panel');
                    // Click the "Show Details" link to render additional error messages
                    const lightningInput =
                        errorPanel.shadowRoot.querySelector('a');
                    lightningInput.dispatchEvent(new CustomEvent('click'));
                })
                .then(() => {
                    const errorPanel =
                        element.shadowRoot.querySelector('c-error-panel');
                    const text = errorPanel.shadowRoot.textContent;
                    expect(text).toContain(defaultError);
                });
        });
    });

    describe('with search bar visible', () => {
        it('updates getProducts @wire with searchKey as filter when search bar changes', () => {
            const input = 'foo';
            const expected = { searchKey: input };
            const element = createElement('c-product-tile-list', {
                is: ProductTileList
            });
            element.searchBarIsVisible = true;
            document.body.appendChild(element);
            getProducts.emit(mockGetProducts);

            return Promise.resolve()
                .then(() => {
                    const searchBar =
                        element.shadowRoot.querySelector('.search-bar');
                    searchBar.value = input;
                    searchBar.dispatchEvent(new CustomEvent('change'));
                })
                .then(() => {
                    const { filters } = getProducts.getLastConfig();
                    expect(filters).toEqual(expected);
                });
        });
    });

    describe('with filter changes', () => {
        it('updates product list when filters change', () => {
            const element = createElement('c-product-tile-list', {
                is: ProductTileList
            });
            document.body.appendChild(element);

            // Simulate filter change
            const mockMessage = {
                filters: { searchKey: 'mockValue', maxPrice: 666 }
            };
            publish(null, PRODUCTS_FILTERED_MESSAGE, mockMessage);

            // Check that wire gets called with new filters
            return Promise.resolve().then(() => {
                const { filters } = getProducts.getLastConfig();
                expect(filters).toEqual(mockMessage.filters);
            });
        });
    });

    it('is accessible when products returned', () => {
        const element = createElement('c-product-tile-list', {
            is: ProductTileList
        });

        document.body.appendChild(element);
        getProducts.emit(mockGetProducts);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when no products returned', () => {
        const element = createElement('c-product-tile-list', {
            is: ProductTileList
        });

        document.body.appendChild(element);
        getProducts.emit(mockGetProductsNoRecords);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when error returned', () => {
        const element = createElement('c-product-tile-list', {
            is: ProductTileList
        });

        document.body.appendChild(element);
        getProducts.error();

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});

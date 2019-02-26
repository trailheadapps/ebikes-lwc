import { createElement } from 'lwc';
import ProductFilter from 'c/productFilter';
import { fireEvent } from 'c/pubsub';
import {
    registerLdsTestWireAdapter,
    registerTestWireAdapter
} from '@salesforce/lwc-jest';
import { CurrentPageReference } from 'lightning/navigation';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

// Mock out the event firing function to verify it was called with expected parameters.
jest.mock('c/pubsub', () => {
    return {
        fireEvent: jest.fn()
    };
});

/*
 * Import a snapshot of getPicklistValues' response for functional verification. This eliminates
 * the need to connect to an org to retrieve data, which allows for running all unit tests
 * on localhost (aka offline).
 *
 * This data can be captured using a REST client accessing the UI API resource which the
 * @wire(getPicklistValues) represents:
 * /ui-api/object-info/{objectApiName}/picklist-values/{recordTypeId}/{fieldApiName}
 * Documentation for this UI API resource is at
 * https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_resources_picklist_values.htm
 *
 * Community-provided instructions for access Salesforce REST resources is at
 * https://blog.mkorman.uk/using-postman-to-explore-salesforce-restful-web-services/
 */
const mockGetPicklistValues = require('./data/getPicklistValues.json');

// Register as an LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getPicklistValuesAdapter = registerLdsTestWireAdapter(getPicklistValues);

// Register as a standard wire adapter because the component under test requires this adapter.
// We don't exercise this wire adapter in the tests.
registerTestWireAdapter(CurrentPageReference);

describe('c-product-filter', () => {
    beforeEach(() => {
        // Reset timer mocks
        jest.useFakeTimers();
    });

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    describe('filterChange event', () => {
        it('fired when slider value changes', () => {
            const expectedPrice = 500;
            const element = createElement('c-product-filter', {
                is: ProductFilter
            });
            document.body.appendChild(element);

            const slider = element.shadowRoot.querySelector('lightning-slider');
            slider.value = expectedPrice;
            slider.dispatchEvent(new CustomEvent('change'));
            // Run timers eg setTimeout()
            jest.runAllTimers();

            // Only verify the relevant params
            expect(fireEvent).toHaveBeenCalledWith(
                undefined,
                'filterChange',
                expect.objectContaining({ maxPrice: expectedPrice })
            );
        });

        it('fired when search value changes', () => {
            const expectedSearchKey = 'search string';
            const element = createElement('c-product-filter', {
                is: ProductFilter
            });
            document.body.appendChild(element);

            const searchInput = element.shadowRoot.querySelector(
                'lightning-input'
            );
            searchInput.value = expectedSearchKey;
            searchInput.dispatchEvent(new CustomEvent('change'));
            // Run timers eg setTimeout()
            jest.runAllTimers();

            // Only verify the relevant params
            expect(fireEvent).toHaveBeenCalledWith(
                undefined,
                'filterChange',
                expect.objectContaining({ searchKey: expectedSearchKey })
            );
        });

        it('fired when checkbox is toggled', () => {
            const element = createElement('c-product-filter', {
                is: ProductFilter
            });
            element.commuter = false;
            document.body.appendChild(element);

            getPicklistValuesAdapter.emit(mockGetPicklistValues);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise ends in the
            // rejected state
            return Promise.resolve()
                .then(() => {
                    verifyFilterToggle(element, 'categories');
                })
                .then(() => {
                    verifyFilterToggle(element, 'materials');
                })
                .then(() => {
                    verifyFilterToggle(element, 'levels');
                });
        });

        function verifyFilterToggle(element, filter) {
            const checkbox = element.shadowRoot.querySelector(
                `[data-filter="${filter}"]`
            );
            checkbox.checked = false;
            checkbox.dispatchEvent(new CustomEvent('change'));
            // Filters are initialized to include all values emitted by getPicklistValuesAdapter, which is one item
            // per filter. Toggling it results in that filter being empty.
            expect(fireEvent).toHaveBeenCalledWith(
                undefined,
                'filterChange',
                expect.objectContaining({ [filter]: [] })
            );
        }
    });

    describe('getPicklistValues @wire error', () => {
        it('shows error message elements', () => {
            const element = createElement('c-product-filter', {
                is: ProductFilter
            });
            document.body.appendChild(element);

            getPicklistValuesAdapter.error();

            return Promise.resolve().then(() => {
                const messages = element.shadowRoot.querySelectorAll(
                    'c-inline-message'
                );
                // One error message per @wire
                expect(messages).toHaveLength(3);
            });
        });

        it.each(['categories', 'materials', 'levels'])(
            'does not render %s input options',
            type => {
                const element = createElement('c-product-filter', {
                    is: ProductFilter
                });
                document.body.appendChild(element);

                getPicklistValuesAdapter.error();

                return Promise.resolve().then(() => {
                    const input = element.shadowRoot.querySelector(
                        `[data-filter="${type}"]`
                    );
                    expect(input).toBeNull();
                });
            }
        );
    });
});

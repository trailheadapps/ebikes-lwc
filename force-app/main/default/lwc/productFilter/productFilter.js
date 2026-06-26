import { LightningElement, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { gql, graphql } from 'lightning/graphql';

// Product schema
import LEVEL_FIELD from '@salesforce/schema/Product__c.Level__c';

// Lightning Message Service and a message channel
import { publish, MessageContext } from 'lightning/messageService';
import PRODUCTS_FILTERED_MESSAGE from '@salesforce/messageChannel/ProductsFiltered__c';

// The delay used when debouncing event handlers before firing the event
const DELAY = 350;

/**
 * Displays a filter panel to search for Product__c[].
 */
export default class ProductFilter extends LightningElement {
    searchKey = '';
    maxPrice = 10000;
    productFamilies = [];
    productFamilyError;

    filters = {
        searchKey: '',
        maxPrice: 10000
    };

    @wire(MessageContext)
    messageContext;

    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: LEVEL_FIELD
    })
    levels;

    @wire(graphql, {
        query: gql`
            query getProductFamilies {
                uiapi {
                    query {
                        Product_Family__c(orderBy: { Name: { order: ASC } }) {
                            edges {
                                node {
                                    Id
                                    Name {
                                        value
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `
    })
    wiredProductFamilies({ errors, data }) {
        if (data) {
            this.productFamilies = data.uiapi.query.Product_Family__c.edges.map(
                (edge) => ({
                    Id: edge.node.Id,
                    Name: edge.node.Name.value
                })
            );
            this.productFamilyError = undefined;
        } else if (errors?.length > 0) {
            this.productFamilyError = errors.join(',');
            this.productFamilies = [];
        }
    }

    get productFamilyOptions() {
        const options = [{ label: 'All', value: '' }];
        this.productFamilies.forEach((family) => {
            options.push({ label: family.Name, value: family.Id });
        });
        return options;
    }

    handleSearchKeyChange(event) {
        this.filters.searchKey = event.target.value;
        this.delayedFireFilterChangeEvent();
    }

    handleMaxPriceChange(event) {
        const maxPrice = event.target.value;
        this.filters.maxPrice = maxPrice;
        this.delayedFireFilterChangeEvent();
    }

    handleProductFamilyChange(event) {
        this.filters.productFamily = event.target.value;
        this.delayedFireFilterChangeEvent();
    }

    handleCheckboxChange(event) {
        if (!this.filters.levels) {
            // Lazy initialize filters with all values initially set
            this.filters.levels = this.levels.data.values.map(
                (item) => item.value
            );
        }
        const value = event.target.dataset.value;
        const filterArray = this.filters[event.target.dataset.filter];
        if (event.target.checked) {
            if (!filterArray.includes(value)) {
                filterArray.push(value);
            }
        } else {
            this.filters[event.target.dataset.filter] = filterArray.filter(
                (item) => item !== value
            );
        }
        // Published ProductsFiltered message
        publish(this.messageContext, PRODUCTS_FILTERED_MESSAGE, {
            filters: this.filters
        });
    }

    delayedFireFilterChangeEvent() {
        // Debouncing this method: Do not actually fire the event as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex
        // method calls in components listening to this event.
        window.clearTimeout(this.delayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            // Published ProductsFiltered message
            publish(this.messageContext, PRODUCTS_FILTERED_MESSAGE, {
                filters: this.filters
            });
        }, DELAY);
    }
}

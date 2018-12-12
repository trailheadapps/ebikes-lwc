import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

/** getProducts() method in ProductController Apex class */
import getProducts from '@salesforce/apex/ProductController.getProducts';

/** Pub-sub mechanism for sibling component communication. */
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

/**
 * Container component that loads and displays a list of Product__c records.
 */
export default class ProductTileList extends LightningElement {
    /**
     * Whether to display the search bar.
     * TODO - normalize value because it may come as a boolean, string or otherwise.
     */
    @api searchBarIsVisible = false;

    /**
     * Whether the product tiles are draggable.
     * TODO - normalize value because it may come as a boolean, string or otherwise.
     */
    @api tilesAreDraggable = false;

    /** All available Product__c[]. */
    @track products = [];

    /** Current page in the product list. */
    @track pageNumber = 1;

    /** The number of items on a page. */
    @track pageSize;

    /** The total number of items matching the selection. */
    @track totalItemCount = 0;

    /** JSON.stringified version of filters to pass to apex */
    filters = '{}';

    @wire(CurrentPageReference) pageRef;

    /**
     * Load the list of available products.
     */
    @wire(getProducts, { filters: '$filters', pageNumber: '$pageNumber' })
    products;

    connectedCallback() {
        registerListener('filterChange', this.handleFilterChange, this);
    }

    handleProductSelected(event) {
        fireEvent(this.pageRef, 'productSelected', event.detail);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    handleSearchKeyChange(event) {
        const searchKey = event.target.value.toLowerCase();
        this.handleFilterChange({ searchKey });
    }

    handleFilterChange(filters) {
        this.filters = JSON.stringify(filters);
        this.pageNumber = 1;
    }

    handlePreviousPage() {
        this.pageNumber = this.pageNumber - 1;
    }

    handleNextPage() {
        this.pageNumber = this.pageNumber + 1;
    }
}

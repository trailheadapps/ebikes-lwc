import { LightningElement, api, wire } from 'lwc';
import { loadScript } from 'c/resourceLoader';
import { loadStyle } from 'lightning/platformResourceLoader';
import analyticsLib from '@salesforce/resourceUrl/myAnalyticsLibResource';
import globalStyling from '@salesforce/resourceUrl/globalStyling';

// Lightning Message Service and message channels
import { publish, subscribe, MessageContext } from 'lightning/messageService';
import PRODUCTS_FILTERED_MESSAGE from '@salesforce/messageChannel/ProductsFiltered__c';
import PRODUCT_SELECTED_MESSAGE from '@salesforce/messageChannel/ProductSelected__c';

// getProducts() method in ProductController Apex class
import getProducts from '@salesforce/apex/ProductController.getProducts';

/**
 * Container component that loads and displays a list of Product__c records.
 */
export default class ProductTileList extends LightningElement {
    static renderMode = 'light'; // the default is 'shadow'

    /**
     * Whether to display the search bar.
     */
    @api searchBarIsVisible = false;

    /**
     * Whether the product tiles are draggable.
     */
    @api tilesAreDraggable = false;

    /**
     * min-size of the pictures shown
     */
    @api minPictureWidth;

    libsLoaded = false;

    /** Current page in the product list. */
    pageNumber = 1;

    /** The number of items on a page. */
    pageSize;

    /** The total number of items matching the selection. */
    totalItemCount = 0;

    /** JSON.stringified version of filters to pass to apex */
    filters = {};

    /** Load context for Lightning Messaging Service */
    @wire(MessageContext) messageContext;

    /** Subscription for ProductsFiltered Lightning message */
    productFilterSubscription;

    /**
     * Load the list of available products.
     */
    @wire(getProducts, { filters: '$filters', pageNumber: '$pageNumber' })
    products;

    connectedCallback() {
        // Subscribe to ProductsFiltered message
        this.productFilterSubscription = subscribe(
            this.messageContext,
            PRODUCTS_FILTERED_MESSAGE,
            (message) => this.handleFilterChange(message)
        );
    }

    renderedCallback() {
        const productTiles = this.querySelectorAll('c-product-tile');
        productTiles.forEach((tile) => {
            tile.style.minWidth = `${this.minPictureWidth}px`;
        });

        if (productTiles.length > 0 && !this.libsLoaded) {
            loadScript(analyticsLib);
            loadStyle(this, globalStyling);
            this.libsLoaded = true;
        }
    }

    handleProductSelected(event) {
        // Published ProductSelected message
        publish(this.messageContext, PRODUCT_SELECTED_MESSAGE, {
            productId: event.detail
        });
    }

    handleSearchKeyChange(event) {
        this.filters = {
            searchKey: event.target.value.toLowerCase()
        };
        this.pageNumber = 1;
    }

    handleFilterChange(message) {
        this.filters = { ...message.filters };
        this.pageNumber = 1;
    }

    handlePreviousPage() {
        this.pageNumber = this.pageNumber - 1;
    }

    handleNextPage() {
        this.pageNumber = this.pageNumber + 1;
    }
}

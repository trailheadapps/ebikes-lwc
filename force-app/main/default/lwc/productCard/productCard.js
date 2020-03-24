import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';

/** Utils to extract field values. */
import { getFieldValue } from 'lightning/uiRecordApi';

/** Pub-sub mechanism for sibling component communication. */
import { registerListener, unregisterAllListeners } from 'c/pubsub';

/** Product__c Schema. */
import PRODUCT_OBJECT from '@salesforce/schema/Product__c';
import NAME_FIELD from '@salesforce/schema/Product__c.Name';
import PICTURE_URL_FIELD from '@salesforce/schema/Product__c.Picture_URL__c';

/**
 * Component to display details of a Product__c.
 */
export default class ProductCard extends NavigationMixin(LightningElement) {
    /** Id of Product__c to display. */
    recordId;

    /** Product fields displayed with specific format */
    productName;
    productPictureUrl;

    @wire(CurrentPageReference) pageRef;

    connectedCallback() {
        registerListener('productSelected', this.handleProductSelected, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    handleRecordLoaded(event) {
        const { records } = event.detail;
        if (records[this.recordId]) {
            const recordData = records[this.recordId];
            this.productName = getFieldValue(recordData, NAME_FIELD);
            this.productPictureUrl = getFieldValue(
                recordData,
                PICTURE_URL_FIELD
            );
        }
    }

    /**
     * Handler for when a product is selected. When `this.recordId` changes, the @wire
     * above will detect the change and provision new data.
     */
    handleProductSelected(productId) {
        this.recordId = productId;
    }

    handleNavigateToRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: PRODUCT_OBJECT.objectApiName,
                actionName: 'view'
            }
        });
    }
}

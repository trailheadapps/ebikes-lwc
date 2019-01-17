import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import PRODUCT_OBJECT from '@salesforce/schema/Product__c';

/**
 * A presentation component to display a Product__c sObject. The provided
 * Product__c data must contain all fields used by this component.
 */
export default class ProductListItem extends NavigationMixin(LightningElement) {
    @api product;

    /** View Details Handler to navigates to the record page */
    handleViewDetailsClick() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.product.Id,
                objectApiName: PRODUCT_OBJECT.objectApiName,
                actionName: 'view'
            }
        });
    }
}

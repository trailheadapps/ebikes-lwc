import { api, LightningElement } from 'lwc';
import CATEGORY_FIELD from '@salesforce/schema/Product__c.Category__c';
import LEVEL_FIELD from '@salesforce/schema/Product__c.Level__c';
import MSRP__FIELD from '@salesforce/schema/Product__c.MSRP__c';
export default class MyProductCard extends LightningElement {
    levelField = LEVEL_FIELD;
    categoryField = CATEGORY_FIELD ; 
    msrpField = MSRP__FIELD
    _product;

    @api
    get product() {
        return this._product;
    }
    set product(value) {
        this._product = value;
    }
    connectedCallback() {
        console.log('hello' + this._product);
    }
}

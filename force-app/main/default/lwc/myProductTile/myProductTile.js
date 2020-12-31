import { LightningElement, api } from 'lwc';

export default class MyProductTile extends LightningElement {
    _product; //fgfgf
    @api
    get product() {
        return this._product;
    }
    set product(value) {
        this._product = value;
        this.pictureUrl = value.Picture_URL__c;
        this.name = value.Name;
        this.msrp = value.MSRP__c;
    }
    pictureUrl;
    name;
    msrp;
    handleClick(event){

        const selectedEvent = new CustomEvent('selected', {
            detail: this.product.Id
        });
        this.dispatchEvent(selectedEvent);
    }
}

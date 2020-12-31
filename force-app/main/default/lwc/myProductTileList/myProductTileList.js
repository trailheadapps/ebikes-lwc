import { LightningElement, wire,api } from 'lwc';
import getProducts from '@salesforce/apex/ProductController.getProducts';
export default class MyProductTileList extends LightningElement {
    recordId={};
    pageNumber=1;
    _selectedProductId
    @api get SelectedProductId(){
        return this._selectedProductId;
    }
    set SelectedProductId(value){
        this._selectedProductId = value;
    }
    @wire(getProducts, { filters: '$recordId', pageNumber: '$pageNumber' })
    products;
    handleProductSelected(event){
        this._selectedProductId = event.detail;
        const selectedEvent = new CustomEvent('productselected', {
            detail: { productId: this._selectedProductId}
        });
        this.dispatchEvent(selectedEvent);
        //console.log();
    }
}

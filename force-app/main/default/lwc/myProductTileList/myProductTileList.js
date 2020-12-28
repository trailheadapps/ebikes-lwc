import { LightningElement, wire } from 'lwc';
import getProducts from '@salesforce/apex/ProductController.getProducts';
export default class MyProductTileList extends LightningElement {
    recordId={};
    pageNumber=1;
    @wire(getProducts, { filters: '$recordId', pageNumber: '$pageNumber' })
    products;
}

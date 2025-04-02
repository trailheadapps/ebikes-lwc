import { LightningElement } from 'lwc';

export default class Selector extends LightningElement {
    selectedProductId;

    handleProductSelected(evt) {
        this.selectedProductId = evt.detail;
    }
}

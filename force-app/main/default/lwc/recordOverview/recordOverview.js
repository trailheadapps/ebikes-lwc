import { LightningElement, api } from 'lwc';

export default class CaseOverview extends LightningElement {
    @api title;
    @api iconName;
    @api recordId;
    @api objectApiName;
    @api fieldNames;
    @api isReadonly;

    get fields() {
        const fields = this.fieldNames?.split(',').map((fieldApiName) => ({
            fieldApiName: fieldApiName.trim(),
            objectApiName: this.objectApiName
        }));
        return fields ?? [];
    }

    get mode() {
        return this.isReadonly ? 'readonly' : 'view';
    }
}

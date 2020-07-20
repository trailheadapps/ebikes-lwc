import { LightningElement, api } from 'lwc';

/**
 * Displays an Order_Item__c SObject. Note that this component does not use schema imports and uses dynamic
 * references to the schema instead. For example, orderItem.Price__c (see template). The dynamic approach is
 * less verbose but does not provide referential integrity. The schema imports approach is more verbose but
 * enforces referential integrity: 1) The existence of the fields you reference is checked at compile time.
 * 2) Fields that are statically imported in a component cannot be deleted in the object model.
 */
export default class OrderItemTile extends LightningElement {
    /** Order_Item__c SObject to display. */
    @api orderItem;

    /** Whether the component has unsaved changes. */
    isModified = false;

    /** Mutated/unsaved Order_Item__c values. */
    form = {};

    /** Handles form input. */
    handleFormChange(evt) {
        this.isModified = true;
        const field = evt.target.dataset.fieldName;
        let value = parseInt(evt.detail.value.trim(), 10);
        if (!Number.isInteger(value)) {
            value = 0;
        }
        this.form[field] = value;
    }

    /** Fires event to update the Order_Item__c SObject.  */

    saveOrderItem() {
        const event = new CustomEvent('orderitemchange', {
            detail: Object.assign({}, { Id: this.orderItem.Id }, this.form)
        });
        this.dispatchEvent(event);
        this.isModified = false;
    }

    /** Fires event to delete the Order_Item__c SObject.  */
    deleteOrderItem() {
        const event = new CustomEvent('orderitemdelete', {
            detail: { id: this.orderItem.Id }
        });
        this.dispatchEvent(event);
    }
}

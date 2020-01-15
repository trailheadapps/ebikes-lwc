import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import BILLING_CITY from '@salesforce/schema/Account.BillingCity';
import BILLING_COUNTRY from '@salesforce/schema/Account.BillingCountry';
import BILLING_POSTAL_CODE from '@salesforce/schema/Account.BillingPostalCode';
import BILLING_STATE from '@salesforce/schema/Account.BillingState';
import BILLING_STREET from '@salesforce/schema/Account.BillingStreet';

const fields = [
    BILLING_CITY,
    BILLING_COUNTRY,
    BILLING_POSTAL_CODE,
    BILLING_STATE,
    BILLING_STREET
];

export default class PropertyMap extends LightningElement {
    @api recordId;

    zoomLevel = 14;
    markers = [];
    error;

    @wire(getRecord, { recordId: '$recordId', fields })
    wiredRecord({ error, data }) {
        if (data) {
            this.markers = [];
            this.error = undefined;
            const street = getFieldValue(data, BILLING_STREET);
            if (street) {
                this.markers = [
                    {
                        location: {
                            City: getFieldValue(data, BILLING_CITY),
                            Country: getFieldValue(data, BILLING_COUNTRY),
                            PostalCode: getFieldValue(
                                data,
                                BILLING_POSTAL_CODE
                            ),
                            State: getFieldValue(data, BILLING_STATE),
                            Street: street
                        }
                    }
                ];
            }
        } else if (error) {
            this.markers = [];
            this.error = error;
        }
    }
}

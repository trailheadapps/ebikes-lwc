import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getRecordInfo from '@salesforce/apex/ProductRecordInfoController.getRecordInfo';

/**
 * Details component that is on top of the video.
 */
export default class HeroDetails extends NavigationMixin(LightningElement) {
    @api title;
    @api slogan;
    @api recordName;
    @api recordInfoData;

    @track hrefUrl;

    @wire(getRecordInfo, { productOrFamilyName: '$recordName' })
    recordInfo({ error, data }) {
        this.recordInfoData = { error, data };
        // Temporary workaround so that clicking on button navigates every time
        if (!error && data) {
            if (data[1] === 'Product__c') {
                this.hrefUrl = `product/${data[0]}`;
            } else {
                this.hrefUrl = `product-family/${data[0]}`;
            }
        }
    }

    // Implement this when lightning-navigation in Communities is fixed
    onButtonClickHandler(evt) {
        // Stop the event's default behavior.
        // Stop the event from bubbling up in the DOM.
        evt.preventDefault();
        evt.stopPropagation();

        if (
            !this.recordInfoData ||
            !this.recordInfoData.data ||
            this.recordInfoData.error
        ) {
            // eslint-disable-next-line no-console
            console.error('No record information! Cannot navigate anywhere!');
            return;
        }

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordInfoData.data[0],
                objectApiName: this.recordInfoData.data[1],
                actionName: 'view'
            }
        });
    }
}

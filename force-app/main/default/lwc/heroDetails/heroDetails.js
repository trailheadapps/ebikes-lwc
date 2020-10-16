import { LightningElement, api, wire } from 'lwc';
import getRecordInfo from '@salesforce/apex/ProductRecordInfoController.getRecordInfo';

/**
 * Details component that is on top of the video.
 */
export default class HeroDetails extends LightningElement {
    @api title = 'Hero Details'; // Default title to comply with accessibility
    @api slogan;
    @api recordName;

    recordInfoData;
    hrefUrl;

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
}

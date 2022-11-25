import { LightningElement, api } from 'lwc';

/** Static Resources. */
import SWAG_ASSETS_URL from '@salesforce/resourceUrl/swag_assets';

export default class Placeholder extends LightningElement {
    @api message;

    /** Url for bike logo. */
    logoUrl = `${SWAG_ASSETS_URL}/bear_sunglasses.svg`;
}

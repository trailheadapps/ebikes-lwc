import { LightningElement, api } from 'lwc';

/** Static Resources */
import BIKE_ASSETS_URL from '@salesforce/resourceUrl/bike_assets';

export default class Placeholder extends LightningElement {
    @api message;

    /** URL for bike logo */
    get logoUrl() {
        return `${BIKE_ASSETS_URL}/logo.svg`;
    }
}

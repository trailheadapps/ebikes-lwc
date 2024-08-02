import { LightningElement, api } from 'lwc';

/** Static Resources */
import BIKE_ASSETS_URL from '@salesforce/resourceUrl/bike_assets';

export default class ProductFamilyTile extends LightningElement {
    @api name;
    @api description;
    @api category;

    get imageSrc() {
        return `${BIKE_ASSETS_URL}/${this.category?.toLowerCase()}.png`;
    }
}

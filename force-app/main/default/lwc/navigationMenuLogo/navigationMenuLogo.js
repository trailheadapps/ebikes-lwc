import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

/** Static Resources */
import BIKE_ASSETS_URL from '@salesforce/resourceUrl/bike_assets';

export default class NavigationMenuLogo extends NavigationMixin(
    LightningElement
) {
    static shadowSupportMode = 'native';

    @api formfactor;
    @api page;

    /** URL for bike logo */
    get logo() {
        return `${BIKE_ASSETS_URL}/logo.svg`;
    }

    handleClick(evt) {
        // use the NavigationMixin from lightning/navigation to perform the navigation.
        // prevent default anchor link since lightning navigation will be handling the click
        evt.stopPropagation();
        evt.preventDefault();
        // Navigate to the home page
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Home'
            }
        });
    }
}

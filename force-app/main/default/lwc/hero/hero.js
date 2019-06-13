import { LightningElement, api } from 'lwc';
import IMAGE_URL from '@salesforce/resourceUrl/bike_assets';

const VIDEO = 'Video';
const IMAGE = 'Image';

/**
 * A Hero component that can display a Video or Image.
 */
export default class Hero extends LightningElement {
    @api title;
    @api slogan;
    @api buttonText;
    @api heroDetailsPosition;
    @api resourceUrl;
    @api imgOrVideo;
    @api internalResource;
    @api overlay;
    @api opacity;
    @api buttonClickProductOrFamilyName;

    get resUrl() {
        if (this.isImg) {
            if (this.internalResource) {
                return IMAGE_URL + this.resourceUrl;
            }
        }
        return this.resourceUrl;
    }

    get isVideo() {
        return this.imgOrVideo === VIDEO;
    }

    get isImg() {
        return this.imgOrVideo === IMAGE;
    }

    get isOverlay() {
        return this.overlay === 'true';
    }

    // Apply CSS Class depending upon what position to put the hero text block
    get heroDetailsPositionClass() {
        if (this.heroDetailsPosition === 'left') {
            return 'c-hero-center-left';
        } else if (this.heroDetailsPosition === 'right') {
            return 'c-hero-center-right';
        }

        return 'c-hero-center-default';
    }

    renderedCallback() {
        // Update the overlay with the opacity configured by the admin in builder
        const overlay = this.template.querySelector('div');
        if (overlay) {
            overlay.style.opacity = parseInt(this.opacity, 10) / 10;
        }
    }
}

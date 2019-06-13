import { LightningElement } from 'lwc';

export default class BikeCustomizerButtonBar extends LightningElement {
    handleButtonClick(event) {
        const bikePart = event.target.dataset.type;
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: { bikePart }
            })
        );
    }
}

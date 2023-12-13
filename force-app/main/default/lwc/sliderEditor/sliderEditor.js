import { LightningElement, api } from 'lwc';

export default class SliderEditor extends LightningElement {
    @api label;
    _width = 200; // Default width

    @api
    get value() {
        return this._width;
    }

    set value(width) {
        this._width = width;
    }

    // connectedCallback() {
    //     this.fireWidthChangedEvent();
    // }

    handleChange(event) {
        this._width = event.target.value;
        this.fireWidthChangedEvent();
    }

    fireWidthChangedEvent() {
        this.dispatchEvent(
            new CustomEvent('valuechange', { detail: { value: this.value } })
        );
    }
}

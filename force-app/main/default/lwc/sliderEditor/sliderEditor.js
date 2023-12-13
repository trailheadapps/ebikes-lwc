import { LightningElement, api } from 'lwc';

export default class SliderEditor extends LightningElement {
    @api label;
    _width = 200; // Default width

    @api
    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
    }

    connectedCallback() {
        this.fireWidthChangedEvent();
    }

    handleChange(event) {
        this._width = event.target.value;
        this.fireWidthChangedEvent();
    }

    fireWidthChangedEvent() {
        this.dispatchEvent(
            new CustomEvent('valuechange', { detail: { value: this._width } })
        );
    }
}

import { createElement } from 'lwc';
import Placeholder from 'c/placeholder';

/*
 * By default @salesforce/lwc-jest will resolve the
 * @salesforce/resourceUrl/bike_assets import to be "bike_assets". We could
 * validate that string is present in the test, but we'll override the default
 * import for exemplary purposes.
 */
jest.mock(
    '@salesforce/resourceUrl/bike_assets',
    () => {
        return {
            default: 'url_from_test',
        };
    },
    { virtual: true },
);

describe('c-placeholder', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('sets img url to be bike_assets resource', () => {
        const element = createElement('c-placeholder', {
            is: Placeholder,
        });
        document.body.appendChild(element);
        const img = element.shadowRoot.querySelector('img');
        expect(img.src).toMatch(/url_from_test/);
    });
});

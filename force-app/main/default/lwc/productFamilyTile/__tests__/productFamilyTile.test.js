import { createElement } from 'lwc';
import ProductFamilyTile from 'c/productFamilyTile';

describe('c-product-family-tile', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    /**
     * Creates the component under test and adds it to the virtual DOM
     * @param {Object} props optional custom component properties
     * @returns {Element} the DOM element of the component
     */
    function createComponent(props = {}) {
        const element = createElement('c-product-family-tile', {
            is: ProductFamilyTile
        });
        Object.assign(element, props);
        document.body.appendChild(element);
        return element;
    }

    it('is accessible', async () => {
        const element = createComponent({
            name: 'sample name',
            description: 'sample desc',
            category: 'Commuter'
        });

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});

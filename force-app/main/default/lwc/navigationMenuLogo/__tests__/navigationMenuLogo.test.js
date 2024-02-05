import { createElement } from 'lwc';
import NavigationMenuLogo from 'c/navigationMenuLogo';
import { getNavigateCalledWith } from 'lightning/navigation';
// This test uses a mocked navigation plugin.
// See force-app/test/jest-mocks/navigation.js for the mock
// and see jest.config.js for jest config to use the mock

describe('c-product-family-tile', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Reset the navigation mock between tests
        jest.clearAllMocks();
    });

    it('navigates to home when logo is clicked', () => {
        // Create initial lwc element and attach to virtual DOM
        const element = createElement('c-navigation-menu-logo', {
            is: NavigationMenuLogo
        });
        document.body.appendChild(element);

        // Click on logo
        element.shadowRoot.querySelector('a').click();

        // Verify component called with correct event type and params
        const { pageReference } = getNavigateCalledWith();
        expect(pageReference.type).toBe('comm__namedPage');
        expect(pageReference.attributes.name).toBe('Home');
    });

    it('is accessible', async () => {
        // Create initial lwc element and attach to virtual DOM
        const element = createElement('c-navigation-menu-logo', {
            is: NavigationMenuLogo
        });
        document.body.appendChild(element);

        // Check accessibility
        await expect(element).toBeAccessible();
    });
});

import { createElement } from 'lwc';
import Hero from 'c/hero';
import IMAGE_URL from '@salesforce/resourceUrl/bike_assets';

// Mock realistic data for the public properties
const mockTitle = 'Title';
const mockSlogan = 'Slogan';
const mockButtonText = 'Click Me!';
const mockHeroDetailsPositionLEFT = 'left';
const mockHeroDetailsPositionRIGHT = 'right';
const mockResourceUrl = 'www.salesforce.com';
const mockImgOrVideoIMAGE = 'Image';
const mockImgOrVideoVIDEO = 'Video';
const mockInternalResource = true;
const mockOverlay = 'true';
const mockOpacity = 5;
const mockButtonClickProductOrFamilyName = 'Product';

describe('c-hero', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays an image in the hero when the type is image', () => {
        const element = createElement('c-hero', {
            is: Hero
        });
        element.title = mockTitle;
        element.slogan = mockSlogan;
        element.buttonText = mockButtonText;
        element.heroDetailsPosition = mockHeroDetailsPositionLEFT;
        element.resourceUrl = mockResourceUrl;
        element.imgOrVideo = mockImgOrVideoIMAGE;
        element.internalResource = mockInternalResource;
        element.overlay = mockOverlay;
        element.opacity = mockOpacity;
        element.buttonClickProductOrFamilyName =
            mockButtonClickProductOrFamilyName;
        document.body.appendChild(element);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Select elements for validation
            const imageEl = element.shadowRoot.querySelector('img');
            expect(imageEl).not.toBeNull();
            // Verify that the URL returned matches, in the context of the test, the domain will render as http://localhost/
            expect(imageEl.src).toBe(
                `http://localhost/${IMAGE_URL}${mockResourceUrl}`
            );
        });
    });

    it('displays an video in the hero when the type is video', () => {
        const element = createElement('c-hero', {
            is: Hero
        });
        element.title = mockTitle;
        element.resourceUrl = mockResourceUrl;
        element.imgOrVideo = mockImgOrVideoVIDEO;
        element.internalResource = mockInternalResource;
        document.body.appendChild(element);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Select elements for validation
            const sourceEl = element.shadowRoot.querySelector('source');
            expect(sourceEl).not.toBeNull();
            // Verify that the URL returned matches, in the context of the test, the domain will render as http://localhost/
            expect(sourceEl.src).toBe(`http://localhost/${mockResourceUrl}`);
        });
    });

    it('displays an overlay', () => {
        const element = createElement('c-hero', {
            is: Hero
        });
        element.title = mockTitle;
        element.overlay = mockOverlay;
        element.opacity = mockOpacity;
        document.body.appendChild(element);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Select elements for validation
            const divEl = element.shadowRoot.querySelector('div');
            expect(divEl).not.toBeNull();
            expect(divEl.style.opacity).toBe('0.5');
        });
    });

    it('displays the hero details component positioned left', () => {
        const element = createElement('c-hero', {
            is: Hero
        });
        element.title = mockTitle;
        element.slogan = mockSlogan;
        element.buttonText = mockButtonText;
        element.heroDetailsPosition = mockHeroDetailsPositionLEFT;
        element.buttonClickProductOrFamilyName =
            mockButtonClickProductOrFamilyName;
        document.body.appendChild(element);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Select elements for validation
            const heroDetailsEL =
                element.shadowRoot.querySelector('c-hero-details');
            expect(heroDetailsEL).not.toBeNull();
            expect(
                heroDetailsEL.classList.contains('c-hero-center-left')
            ).toBeTruthy();
            expect(heroDetailsEL.title).toBe(mockTitle);
            expect(heroDetailsEL.slogan).toBe(mockSlogan);
            expect(heroDetailsEL.recordName).toBe(
                mockButtonClickProductOrFamilyName
            );
            const spanEl = element.shadowRoot.querySelector('span');
            expect(spanEl.textContent).toBe(mockButtonText);
        });
    });

    it('displays the hero details component positioned right', () => {
        const element = createElement('c-hero', {
            is: Hero
        });
        element.title = mockTitle;
        element.slogan = mockSlogan;
        element.buttonText = mockButtonText;
        element.heroDetailsPosition = mockHeroDetailsPositionRIGHT;
        element.buttonClickProductOrFamilyName =
            mockButtonClickProductOrFamilyName;
        document.body.appendChild(element);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Select elements for validation
            const heroDetailsEL =
                element.shadowRoot.querySelector('c-hero-details');
            expect(heroDetailsEL).not.toBeNull();
            expect(
                heroDetailsEL.classList.contains('c-hero-center-right')
            ).toBeTruthy();
            expect(heroDetailsEL.title).toBe(mockTitle);
            expect(heroDetailsEL.slogan).toBe(mockSlogan);
            expect(heroDetailsEL.recordName).toBe(
                mockButtonClickProductOrFamilyName
            );
            const spanEl = element.shadowRoot.querySelector('span');
            expect(spanEl.textContent).toBe(mockButtonText);
        });
    });

    it('displays the hero details component positioned center', () => {
        const element = createElement('c-hero', {
            is: Hero
        });
        element.title = mockTitle;
        element.slogan = mockSlogan;
        element.buttonText = mockButtonText;
        element.buttonClickProductOrFamilyName =
            mockButtonClickProductOrFamilyName;
        document.body.appendChild(element);

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Select elements for validation
            const heroDetailsEL =
                element.shadowRoot.querySelector('c-hero-details');
            expect(heroDetailsEL).not.toBeNull();
            expect(
                heroDetailsEL.classList.contains('c-hero-center-default')
            ).toBeTruthy();
            expect(heroDetailsEL.title).toBe(mockTitle);
            expect(heroDetailsEL.slogan).toBe(mockSlogan);
            expect(heroDetailsEL.recordName).toBe(
                mockButtonClickProductOrFamilyName
            );
            const spanEl = element.shadowRoot.querySelector('span');
            expect(spanEl.textContent).toBe(mockButtonText);
        });
    });

    it('is accessible when type image and overlay displayed', () => {
        const element = createElement('c-hero', {
            is: Hero
        });

        element.title = mockTitle;
        element.slogan = mockSlogan;
        element.buttonText = mockButtonText;
        element.heroDetailsPosition = mockHeroDetailsPositionLEFT;
        element.resourceUrl = mockResourceUrl;
        element.imgOrVideo = mockImgOrVideoIMAGE;
        element.internalResource = mockInternalResource;
        element.overlay = mockOverlay;
        element.opacity = mockOpacity;
        element.buttonClickProductOrFamilyName =
            mockButtonClickProductOrFamilyName;
        document.body.appendChild(element);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when type video and overlay displayed', () => {
        const element = createElement('c-hero', {
            is: Hero
        });

        element.title = mockTitle;
        element.resourceUrl = mockResourceUrl;
        element.imgOrVideo = mockImgOrVideoVIDEO;
        element.internalResource = mockInternalResource;
        document.body.appendChild(element);

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});

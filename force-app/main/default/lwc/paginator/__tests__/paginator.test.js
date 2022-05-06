import { createElement } from 'lwc';
import Paginator from 'c/paginator';

describe('c-paginator', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('sends "next" event on button click', () => {
        // Create initial element
        const element = createElement('c-paginator', {
            is: Paginator
        });
        document.body.appendChild(element);

        // Mock handlers for child events
        const handlerNext = jest.fn();

        // Add event listener to catch child events
        element.addEventListener('next', handlerNext);

        // Click the next(>) button
        const nextButtonEl = element.shadowRoot.querySelector('.next');
        nextButtonEl.click();

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Validate if mocked events got fired
            expect(handlerNext.mock.calls.length).toBe(1);
        });
    });

    it('sends "previous" event on button click', () => {
        // Create initial element
        const element = createElement('c-paginator', {
            is: Paginator
        });
        document.body.appendChild(element);

        // Mock handlers for child events
        const handlerPrevious = jest.fn();

        // Add event listener to catch child events
        element.addEventListener('previous', handlerPrevious);

        // Click the Previous(<) button
        const prevButtonEl = element.shadowRoot.querySelector('.previous');
        prevButtonEl.click();

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Validate if mocked events got fired
            expect(handlerPrevious.mock.calls.length).toBe(1);
        });
    });

    it('displays total item count, page number, and number of pages with zero items', () => {
        // Create initial element
        const element = createElement('c-paginator', {
            is: Paginator
        });
        element.pageNumber = 0;
        element.pageSize = 9;
        element.totalItemCount = 0;
        document.body.appendChild(element);

        // Query div for validating the display message on component init
        const navInfoEl = element.shadowRoot.querySelector('.nav-info');
        //Check for the 0 items message
        expect(navInfoEl).not.toBeNull();
        expect(navInfoEl.textContent).toBe('0 items • page 0 of 0');
    });

    it('displays total item count, page number, and number of pages with some items', async () => {
        // Create initial element
        const element = createElement('c-paginator', {
            is: Paginator
        });
        element.pageNumber = 1;
        element.pageSize = 9;
        element.totalItemCount = 12;
        document.body.appendChild(element);

        // Query div for validating the display message on component init
        const navInfoEl = element.shadowRoot.querySelector('.nav-info');

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Query div for validating computed style attribute value on public property change
            expect(navInfoEl).not.toBeNull();
            expect(navInfoEl.textContent).toBe('12 items • page 1 of 2');
        });
    });

    it('is accessible', async () => {
        // Create initial element
        const element = createElement('c-paginator', {
            is: Paginator
        });
        element.pageNumber = 3;
        element.pageSize = 9;
        element.totalItemCount = 12;
        document.body.appendChild(element);

        await Promise.resolve();
        await expect(element).toBeAccessible();
    });
});

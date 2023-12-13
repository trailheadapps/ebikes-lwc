/**
 * Utility function to load a JS file via a script tag.
 * @param {String} url - The path to the JS file.
 * @return {Promise} - A promise resolved once the JS file has been loaded.
 */
export function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.charset = 'utf-8';
        script.type = 'text/javascript';
        document.head.appendChild(script);
        script.addEventListener('load', resolve);
        script.addEventListener('error', reject);
    });
}

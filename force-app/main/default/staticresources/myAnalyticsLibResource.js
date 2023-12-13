// Imagine this is an analytics library!

console.log('ANALYTICS LIB: LOADED!');
const elements = document.querySelectorAll('a.inspect');
elements.forEach((element) => {
    element.addEventListener('click', () => {
        console.log('ANALYTICS LIB: Element was clicked!');
    });
    //element.innerText = 'ELEMENT ACCESSED!';
});

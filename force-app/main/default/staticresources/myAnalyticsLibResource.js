// Imagine this is an analytics library!

console.log('ANALYTICS LIB: LOADED!');
const elements = document.querySelectorAll('a.inspect');
elements.forEach((element) => {
   element.innerText = 'ELEMENT ACCESSED!';
});

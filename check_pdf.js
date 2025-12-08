
const pdf = require('pdf-parse');
console.log('Type of pdf:', typeof pdf);
console.log('Keys:', Object.keys(pdf));
console.log('Is Default a function?', typeof pdf.default);
if (typeof pdf === 'function') console.log('It is a function');

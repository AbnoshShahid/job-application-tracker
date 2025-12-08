const pdf = require('pdf-parse');
console.log("Type:", typeof pdf);
if (typeof pdf === 'object') {
    console.log("Keys:", Object.keys(pdf));
}

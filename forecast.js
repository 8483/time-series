require('./time-series')();

let data = [
    ["2008-1", 20],
    ["2008-2", 30],
    ["2008-3", 39],
    ["2008-4", 60],
    ["2009-1", 40],
    ["2009-2", 51],
    ["2009-3", 62],
    ["2009-4", 81],
    ["2010-1", 50],
    ["2010-2", 64],
    ["2010-3", 74],
    ["2010-4", 95]
];

// Accuracy test
console.log(forecast("2010-1", data)); // 52
console.log(forecast("2010-2", data)); // 67
console.log(forecast("2010-3", data)); // 79
console.log(forecast("2010-4", data)); // 109

// Future data
console.log(forecast("2011-1", data)); // 68
console.log(forecast("2011-2", data)); // 86
console.log(forecast("2011-3", data)); // 99
console.log(forecast("2011-4", data)); // 136
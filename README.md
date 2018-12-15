# Time Series

Based on this [time series analysis video](https://youtu.be/HIWXdHlDSFs). 

**Only works with quarters.**

`forecast(period, data)` takes:  
- A period string in the `year-quarter` i.e. `2018-1` format as the first argument.
- An array of arrays with `quarter-value` pairs as the second argument. 

It returns a prediction for the desired future period. 


A usage example is provided in `forecast.js`.

```javascript
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
```
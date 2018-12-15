module.exports = function () {

    this.forecast = function (period, data) {
        let firstPeriod = data[0][0]; // FirstQuarter as index 0

        function addXCodes(data) {
            let year = getYear(firstPeriod);
            let quarter = getQuarter(firstPeriod);
            data[0].push(1); // First xCode
            for (let i = 1; i < data.length; i++) {
                let xYear = getYear(data[i][0]); // 2018
                let xQuarter = getQuarter(data[i][0]); // 4
                // (2019 - 2018) * 4 + 3 - 2 = 4 + 3 - 2 = 5 // xCode
                let xCode = (xYear - year) * 4 + (xQuarter - quarter) + 1; // +1 because of 0 index
                //     console.log(`(${xYear} - ${year}) * 4 + (${xQuarter} - ${quarter});`)
                //     console.log(x)
                data[i].push(xCode);
            }
        }

        function getYear(str) {
            // console.log(`getYear: ${str}`);
            return parseInt(str.substring(0, 4));
        }

        function getQuarter(str) {
            return parseInt(str.substring(5));
        }

        function getXCode(period) {
            let year = getYear(firstPeriod);
            let quarter = getQuarter(firstPeriod);
            let xYear = getYear(period);
            let xQuarter = getQuarter(period);
            return (xYear - year) * 4 + (xQuarter - quarter) + 1;
        }

        // console.log(data);
        addXCodes(data);
        // console.log(data);

        let ma = [];
        let cma = [];
        let percent = [];
        let seasonality = [];
        let interval = 4; // quarters

        function calculateMovingAverage(data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i + 3] !== undefined) {
                    let average =
                        (data[i][1] +
                            data[i + 1][1] +
                            data[i + 2][1] +
                            data[i + 3][1]) /
                        4;
                    if (average !== undefined) ma.push(average);
                }
            }
        }

        function calculateCenteredMovingAverage(data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i + 1] !== undefined)
                    cma.push((data[i] + data[i + 1]) / 2);
            }
        }

        function calculatePercentChange(data, cma) {
            for (let i = 0; i < cma.length; i++) {
                let quarter = getQuarter(data[i + 2][0]);
                let change = data[i + 2][1] / cma[i];
                // console.log(
                //     `quarter: ${quarter} change: ${change} = data ${
                //         data[i + 2][1]
                //     } / cma ${cma[i]}`
                // );
                if (!isNaN(change) && change != 0) percent.push([quarter, change]);
            }
        }

        function calculateSeasonality(data, quarter) {
            let sum = 0;
            let count = 0;
            for (let i = 0; i < data.length; i++) {
                if (data[i][0] === quarter) {
                    sum += data[i][1];
                    count++;
                }
            }
            // console.log(`calculate seasonality for q${quarter}: ${sum} / ${count}`);
            let seasonality = sum / count;
            // If there is no seasonality, return 1 i.e. the exact predicted value.
            return isNaN(seasonality) ? 1 : seasonality; // mean
        }

        // console.log("Data -----------");
        // console.log(data);
        // console.log("\n");

        // console.log("Moving average -----------");
        calculateMovingAverage(data);
        // console.log(ma);
        // console.log("\n");

        // console.log("Centered moving average -----------");
        calculateCenteredMovingAverage(ma);
        // console.log(cma);
        // console.log("\n");

        // console.log("Percent -----------");
        calculatePercentChange(data, cma);
        // console.log(percent);
        // console.log("\n");

        let q1 = calculateSeasonality(percent, 1);
        // console.log(`q1: ${q1} \n`);
        let q2 = calculateSeasonality(percent, 2);
        // console.log(`q2: ${q2} \n`);
        let q3 = calculateSeasonality(percent, 3);
        // console.log(`q3: ${q3} \n`);
        let q4 = calculateSeasonality(percent, 4);
        // console.log(`q4: ${q4} \n`);

        function adjustedSeasonality(quarter) {
            let adjustmentFactor = 4 / (q1 + q2 + q3 + q4);
            // console.log(
            //     `adjustment factor: ${adjustmentFactor} = 4 / (${q1} + ${q2} + ${q3}+ ${q4})`
            // );
            return calculateSeasonality(percent, quarter) * adjustmentFactor;
        }

        function forecast(x, ky, kx) {
            let i = 0,
                nr = 0,
                dr = 0,
                ax = 0,
                ay = 0,
                a = 0,
                b = 0;
            function average(ar) {
                var r = 0;
                for (i = 0; i < ar.length; i++) {
                    r = r + ar[i];
                }
                return r / ar.length;
            }
            ax = average(kx);
            ay = average(ky);
            for (i = 0; i < kx.length; i++) {
                nr = nr + (kx[i] - ax) * (ky[i] - ay);
                dr = dr + (kx[i] - ax) * (kx[i] - ax);
            }
            b = nr / dr;
            a = ay - b * ax;
            return a + b * x;
        }

        function forecastSeasonality(period, data) {
            let x = data.map(item => item[2]);
            let y = data.map(item => item[1]);

            // console.log(x); // Extract xcodes from data
            // console.log(y); // Extract y values from data

            let before = forecast(getXCode(period), y, x);
            let seasonality = adjustedSeasonality(getQuarter(period));
            let after = Math.floor(before * seasonality);
            // console.log(`after = ${before} * ${seasonality}`);
            let actualHold = data.find(item => item[0] === period);
            let actual = actualHold != undefined ? actualHold[1] : "no data";
            let error = Math.round((after / actual - 1) * 100);

            // console.log(
            //     `period: ${period}, before: ${before}, quarter: ${getQuarter(
            //         period
            //     )}, seasonality: ${seasonality}, after: ${after}, actual: ${actual}, error: ${error}%`
            // );
            return after;
        }
        return forecastSeasonality(period, data);
    }
}
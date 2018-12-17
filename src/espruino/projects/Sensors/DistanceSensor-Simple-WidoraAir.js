const numberOfMeasurements = 10;
const measurements = new Array(numberOfMeasurements);
let nextMeasurement = 0;
const minNumberInRange = 5;
const minNumberOutOfRange = 4;
let lastQueueState = false;
let queueDetected = false;

const sensor = require('HC-SR04').connect(D21, D22, (dist) => {
    //print(`${dist} cm away`);
    const inRange = (dist <= 200);
    measurements[nextMeasurement++] = inRange;
    if (nextMeasurement === numberOfMeasurements)
    {
        nextMeasurement = 0;
    }

    const numberInRange = measurements.map(m => m ? 1 : 0).reduce((acc, m) => acc + m, 0);
    print(`Number in range: ${numberInRange}`);
    if (numberInRange >= minNumberInRange) {
      queueDetected = true;
    } else if (numberInRange <= (numberOfMeasurements - minNumberOutOfRange)) {
      queueDetected = false;
    }

    if (lastQueueState !== queueDetected)
    {
        lastQueueState = queueDetected;
        if (lastQueueState) {
            print(`Publish queue state 'IN RANGE': ${lastQueueState}`);
        } else {
            print(`Publish queue state 'OUT OF RANGE': ${lastQueueState}`);
        }
    }
});

setInterval(() => {
    sensor.trigger(); // send pulse
}, 500);

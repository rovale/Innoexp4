// https://www.espruino.com/HC-SR04
const sensor = require('HC-SR04').connect(D16, D17, (dist) => {
  print(`${dist} cm away`);
});

setInterval(() => {
  sensor.trigger(); // send pulse
}, 500);

// https://www.espruino.com/BMP085
const altitude = 1; // current altitude in m

I2C1.setup({ scl: D16, sda: D17 });
const bmp = require('BMP085').connect(I2C1);

bmp.getPressure((d) => {
  const sealevel = bmp.getSeaLevel(d.pressure, altitude);
  print(`Sea level pressure: ${sealevel} Pa`);
});

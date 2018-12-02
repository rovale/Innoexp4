// https://www.espruino.com/BMP085
const altitude = 1; // current altitude in m

I2C1.setup({ scl: D22, sda: D21 });
const bmp = require('BMP085').connect(I2C1);

setInterval(() => bmp.getPressure((d) => {
  const sealevel = bmp.getSeaLevel(d.pressure, altitude);
  print(`Sea level pressure: ${Math.round(sealevel/100)} hPa`);
}), 1000);

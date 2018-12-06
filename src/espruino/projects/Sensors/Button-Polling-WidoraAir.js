// See https://www.espruino.com/Button
const buttonPin = D15;

//I chose input_pullup, I am not sure if ESP32 supports input_pulldown
pinMode(buttonPin, "input_pullup");
setInterval(() => {
  const value = digitalRead(buttonPin);
  print(value);
}, 1000);

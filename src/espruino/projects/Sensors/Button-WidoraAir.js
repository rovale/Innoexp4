const buttonPin = D15;

pinMode(buttonPin, "input_pullup");
setInterval(() => {
  const value = digitalRead(buttonPin);
  print(value);
}, 1000);


setWatch((e) => {
  console.log("Button pressed");
}, buttonPin, { repeat: true, edge: 'falling', debounce: 50 });

setWatch((e) => {
  console.log("Button released");
}, buttonPin, { repeat: true, edge: 'rising', debounce: 50 });




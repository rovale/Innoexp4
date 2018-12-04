const photoResistorPin = A0;

setInterval(() => {
  const value = analogRead(photoResistorPin);
  print(value);
}, 500);

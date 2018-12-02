setInterval(() => {
  const value = analogRead(A0);
  print(value);
  analogWrite(D4, 1 - value);
}, 500);

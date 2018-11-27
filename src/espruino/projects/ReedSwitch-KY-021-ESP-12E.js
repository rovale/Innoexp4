const buttonPin = D5;
setWatch(() => print('falling'), buttonPin, { repeat: true, edge: 'falling', debounce: 100 });
setWatch(() => print('rising'), buttonPin, { repeat: true, edge: 'rising', debounce: 100 });

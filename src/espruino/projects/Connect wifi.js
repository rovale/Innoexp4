const wifi = require('Wifi');

wifi.connect('mynetwork', { password: 'mypassword' }, (err) => {
  if (err) {
    print('Error', err);
  } else {
    print(wifi.getIP());
  }
});

wifi.save();

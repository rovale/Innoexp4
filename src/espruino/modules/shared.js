const settings = {
  ssid: 'myssid',
  wifiPassword: 'mypassword',
  mqttHost: 'iot.eclipse.org',
  mqttUsername: null,
  mqttPassword: null,
  topic: 'mybuilding/mylocation/',
  id: getSerial().replace('-', '').toUpperCase()
};

exports.settings = settings;

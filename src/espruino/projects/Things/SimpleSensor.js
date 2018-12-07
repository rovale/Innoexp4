/**
 * An example of a simple sensor which reports every 30 seconds.
 */
function start() {
  const wifi = require('Wifi');
  const net = require('net');
  const MqttClient = require('https://github.com/rovale/micro-mqtt/blob/master/espruino/modules/micro-mqtt.js').Client;

  settings = {
    ssid: 'myssid',
    wifiPassword: 'mypassword',
    mqttHost: 'test.mosquitto.org',
    mqttUsername: null,
    mqttPassword: null,
    topic: 'mybuilding/restaurant/',
    id: getSerial().split('-')[1]
  };

  const getStatusMessage = isOnline => ({
    id: settings.id,
    name: 'A simple sensor',
    online: isOnline,
    ip: isOnline ? wifi.getIP().ip : null,
  });

  const getTopic = subject => `${settings.topic}${settings.id}/${subject}`;

  const mqttClient = new MqttClient(
    {
      host: settings.mqttHost,
      clientId: settings.id,
      username: settings.mqttUsername,
      password: settings.mqttPassword,
      will: {
        topic: getTopic('status'),
        message: JSON.stringify(getStatusMessage(false)),
        qos: 1,
        retain: true
      }
    },
    net
  );

  const sensorPin = A0;

  const onBoardLedPin = D2;

  // Set to true for Widora air and connect an LED to D2 and ground.
  const onBoardLedOnValue = false;
  let onBoardLedValue = !onBoardLedOnValue;

  let telemetryInterval = -1;

  const switchOnBoardLed = (newValue) => {
    if (newValue !== onBoardLedValue) {
      onBoardLedValue = newValue;
      digitalWrite(onBoardLedPin, onBoardLedValue);
    }
  };

  const onWifiConnecting = () => {
    print('[Wifi] [Info] Connecting...');
    switchOnBoardLed(onBoardLedOnValue);
  };

  const onWifiConnected = () => {
    print('[Wifi] [Info] Connected:', wifi.getIP());
    mqttClient.connect();
  };

  const connect = () => {
    const connection = wifi.getDetails();
    if (connection.status === 'connected' && connection.ssid === settings.ssid) {
      onWifiConnected();
      return;
    }

    onWifiConnecting();
    wifi.connect(settings.ssid, { password: settings.wifiPassword });
  };

  wifi.on('connected', () => {
    onWifiConnected();
  });

  wifi.on('disconnected', (d) => {
    print('[Wifi] [Error] No connection, details:', d);
    mqttClient.disconnect();
    connect();
  });

  const sendTelemetry = () => {
    let telemetry = {
      freeMemory: process.memory().free,
      rssi: wifi.getDetails().rssi
    };

    mqttClient.publish(getTopic('telemetry/thing'), JSON.stringify(telemetry), 1);

    telemetry = {
      light: analogRead(sensorPin)
    };

    mqttClient.publish(getTopic('telemetry/sensor'), JSON.stringify(telemetry), 1);
  };

  mqttClient.on('connected', () => {
    switchOnBoardLed(!onBoardLedOnValue);
    mqttClient.subscribe(getTopic('command'), 1);

    mqttClient.publish(
      getTopic('status'),
      JSON.stringify(getStatusMessage(true)),
      1,
      true
    );

    telemetryInterval = setInterval(() => sendTelemetry(), 30 * 1000);
    sendTelemetry();
  });

  mqttClient.on('disconnected', () => {
    switchOnBoardLed(onBoardLedOnValue);

    if (telemetryInterval !== -1) {
      clearInterval(telemetryInterval);
      telemetryInterval = -1;
    }
  });

  const doSomething = () => {
  };

  mqttClient.on('receive', (message) => {
    print('[Mqtt] [Info] Incoming message:', message);
    const command = JSON.parse(message.content);

    if (command.name === 'doSomething') doSomething();
  });

  // mqttClient.on("debug", debug => {
  //   print("[Mqtt] [Debug]", debug);
  // });

  mqttClient.on('info', (info) => {
    print('[Mqtt] [Info]', info);
  });

  mqttClient.on('error', (error) => {
    print('[Mqtt] [Error]', error);
  });

  connect();

  global.settings = settings;
  global.wifi = wifi;
  global.mqttClient = mqttClient;
}

start();

/**
 * A Sonoff Basic switching a lamp. Example of digital input and output.
 */
function start() {
  const wifi = require('Wifi');
  const net = require('net');
  const MqttClient = require('https://github.com/rovale/micro-mqtt/blob/master/espruino/modules/micro-mqtt.js').Client;
  const settings = require('http://localhost:5000/shared.js').settings;

  const getStatusMessage = isOnline => ({
    id: settings.id,
    name: 'DigitalInputAndOutput-SonoffBasic',
    online: isOnline,
    network: settings.ssid,
    ip: wifi.getIP().ip,
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

  const buttonPin = D0;
  const relayPin = D12;
  let isTurnedOn = false;

  const onBoardLedPin = D13;
  const onBoardLedOnValue = false;
  let onBoardLedValue = !onBoardLedOnValue;

  let telemetryInterval = -1;
  let blinkInterval = -1;

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
    const telemetry = {
      freeMemory: process.memory().free,
      rssi: wifi.getDetails().rssi,
      isTurnedOn: isTurnedOn
    };

    mqttClient.publish(getTopic('telemetry'), JSON.stringify(telemetry), 1);
  };

  const blinkOn = () => {
    if (blinkInterval === -1) {
      blinkInterval = setInterval(() => switchOnBoardLed(!onBoardLedValue), 500);
    }
  };

  const blinkOff = () => {
    if (blinkInterval !== -1) {
      clearInterval(blinkInterval);
      switchOnBoardLed(!onBoardLedOnValue);
      blinkInterval = -1;
    }
  };

  const switchRelay = (newValue) => {
    if (newValue !== isTurnedOn) {
      isTurnedOn = newValue;
      digitalWrite(relayPin, isTurnedOn);
      sendTelemetry();
    }
  };

  const turnOn = () => {
    print('turnOn');
    switchRelay(true);
  };

  const turnOff = () => {
    print('turnOff');
    switchRelay(false);
  };

  const toggle = () => {
    print('toggle');
    switchRelay(!isTurnedOn);
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
    }
  });

  mqttClient.on('receive', (message) => {
    print('[Mqtt] [Info] Incoming message:', message);
    const command = JSON.parse(message.content);

    if (command.name === 'blinkOn') blinkOn();
    if (command.name === 'blinkOff') blinkOff();
    if (command.name === 'turnOn') turnOn();
    if (command.name === 'turnOff') turnOff();
    if (command.name === 'toggle') toggle();
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

  setWatch(() => toggle(), buttonPin, { repeat: true, edge: 'falling', debounce: 100 });

  global.settings = settings;
  global.wifi = wifi;
  global.mqttClient = mqttClient;
}

start();

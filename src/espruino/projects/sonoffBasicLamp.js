/**
 * A Sonoff Basic switching a lamp
 */
function start() {
  const wifi = require('Wifi');
  const net = require('net');
  const MqttClient = require('https://github.com/rovale/micro-mqtt/blob/master/espruino/modules/micro-mqtt.js').Client;
  const settings = require('http://localhost:5000/shared.js').settings;

  const getTopic = subject => `${settings.topic}${settings.id}/${subject}`;

  const mqttClient = new MqttClient(
    {
      host: settings.mqttHost,
      clientId: settings.id,
      username: settings.mqttUsername,
      password: settings.mqttPassword,
      will: {
        topic: getTopic('status'),
        message: 'offline',
        qos: 1,
        retain: true
      }
    },
    net
  );

  const buttonPin = D0;
  const relaisPin = D12;
  let isTurnedOn = false;
  const ledPin = D13;
  const ledOnValue = false;

  let telemetryInterval = -1;
  let blinkInterval = -1;

  const onWifiConnecting = () => {
    print('[Wifi] [Info] Connecting...');
    digitalWrite(ledPin, ledOnValue);
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
      blinkInterval = setInterval(() => digitalWrite(ledPin, !digitalRead(ledPin)), 500);
    }
  };

  const blinkOff = () => {
    if (blinkInterval !== -1) {
      clearInterval(blinkInterval);
      digitalWrite(ledPin, !ledOnValue);
      blinkInterval = -1;
    }
  };

  const switchRelais = (newValue) => {
    if (newValue !== isTurnedOn) {
      isTurnedOn = newValue;
      digitalWrite(relaisPin, isTurnedOn);
      sendTelemetry();
    }
  };

  const turnOn = () => {
    print('turnOn');
    switchRelais(true);
  };

  const turnOff = () => {
    print('turnOff');
    switchRelais(false);
  };

  const toggle = () => {
    print('toggle');
    switchRelais(!isTurnedOn);
  };

  mqttClient.on('connected', () => {
    digitalWrite(ledPin, !ledOnValue);
    mqttClient.subscribe(getTopic('command'), 1);
    mqttClient.publish(getTopic('status'), 'online', 1, true);

    const details = {
      name: 'Sonoff Basic Lamp',
      network: settings.ssid,
      ip: wifi.getIP().ip
    };

    mqttClient.publish(
      getTopic('details'),
      JSON.stringify(details),
      1,
      true
    );

    telemetryInterval = setInterval(() => sendTelemetry(), 30 * 1000);
    sendTelemetry();
  });

  mqttClient.on('disconnected', () => {
    digitalWrite(ledPin, ledOnValue);

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

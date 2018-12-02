/**
 * An ESP-12E with a photoresistor (light sensor) and an LED which is being dimmed.
 * Example of analog input and output.
 */
function start() {
  const wifi = require('Wifi');
  const net = require('net');
  const MqttClient = require('https://github.com/rovale/micro-mqtt/blob/master/espruino/modules/micro-mqtt.js').Client;
  const settings = require('http://localhost:5000/shared.js').settings;

  const getStatusMessage = isOnline => ({
    id: settings.id,
    name: 'AnalogInputAndOutput-ESP-12E',
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

  const sensorPin = A0;
  const dimmableLedPin = D4;

  const onBoardLedPin = D2;
  const onBoardLedOnValue = false;
  let onBoardLedValue = !onBoardLedOnValue;

  let telemetryInterval = -1;
  let blinkInterval = -1;
  let autoDimInterval = -1;

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

  const autoDimOn = () => {
    if (autoDimInterval === -1) {
      autoDimInterval = setInterval(() => {
        // print(analogRead(sensorPin));
        analogWrite(dimmableLedPin, 1 - analogRead(sensorPin));
      }, 500);
    }
  };

  const autoDimOff = () => {
    if (autoDimInterval !== -1) {
      clearInterval(autoDimInterval);
      analogWrite(dimmableLedPin, 0);
      autoDimInterval = -1;
    }
  };

  const dim = (value) => {
    autoDimOff();
    analogWrite(dimmableLedPin, value);
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
    if (command.name === 'autoDimOn') autoDimOn();
    if (command.name === 'autoDimOff') autoDimOff();
    if (command.name === 'dim') dim(command.value);
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

  autoDimOn();
  connect();

  global.settings = settings;
  global.wifi = wifi;
  global.mqttClient = mqttClient;
}

start();

function start() {
  const wifi = require('Wifi');
  const net = require('net');
  const MqttClient = require('https://github.com/rovale/micro-mqtt/blob/master/espruino/modules/micro-mqtt.js').Client;

  const settings = {
    ssid: 'ssid',
    wifiPassword: 'pw',
    mqttHost: 'host',
    mqttUsername: null,
    mqttPassword: null,
    topic: 'company/room/',
    id: getSerial().split('-')[1]
  };

  const getStatusMessage = isOnline => ({
    id: settings.id,
    name: 'One or more super duper ultrasonic sensors',
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

  const onBoardLedPin = D2;

  // Set to true for Widora air and connect an LED to D2 and ground.
  const onBoardLedOnValue = true;
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

  const sendTelemetry = (sensorId, inRange) => {
    let telemetry = {
      freeMemory: process.memory().free
    };

    mqttClient.publish(getTopic('telemetry/thing'), JSON.stringify(telemetry), 1);

    if (sensorId !== undefined) {
      telemetry = {
        "sensorId": sensorId,
        "inRange": inRange
      };

      mqttClient.publish(getTopic('telemetry/sensor'), JSON.stringify(telemetry), 1);
    }
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

  const numberOfMeasurements = 10;
  const measurements1 = new Array(numberOfMeasurements);
  let nextMeasurement = 0;
  const minNumberInRange = 5;
  const minNumberOutOfRange = 4;
  let lastQueueState = false;
  let queueDetected = false;
  
  print('Connecting to HC-SR04 sensor 1...');
  const sensor1 = require('HC-SR04').connect(D21, D22, (dist) => {
      const inRange = (dist <= 200);
      measurements1[nextMeasurement++] = inRange;
      if (nextMeasurement === numberOfMeasurements)
      {
          nextMeasurement = 0;
      }
  
      const numberInRange = measurements1.map(m => m ? 1 : 0).reduce((acc, m) => acc + m, 0);
      print(`Sensor 1 - People in range: ${numberInRange}`);
      if (numberInRange >= minNumberInRange) {
        queueDetected = true;
      } else if (numberInRange <= (numberOfMeasurements - minNumberOutOfRange)) {
        queueDetected = false;
      }
  
      if (lastQueueState !== queueDetected)
      {
          lastQueueState = queueDetected;
          if (lastQueueState) {
            print('Sensor 1 - People moved in range...');
            sendTelemetry(1, 1);
          } else {
            print('Sensor 1 - People moved out of range...');
            sendTelemetry(1, 0);
          }
      }
  });

  const measurements2 = new Array(numberOfMeasurements);
  let nextMeasurement2 = 0;
  let lastQueueState2 = false;
  let queueDetected2 = false;
  
  print('Connecting to HC-SR04 sensor 2...');
  const sensor2 = require('HC-SR04').connect(D19, D18, (dist) => {
      const inRange = (dist <= 200);
      measurements2[nextMeasurement2++] = inRange;
      if (nextMeasurement2 === numberOfMeasurements)
      {
          nextMeasurement2 = 0;
      }
  
      const numberInRange = measurements2.map(m => m ? 1 : 0).reduce((acc, m) => acc + m, 0);
      print(`Sensor 2 - People in range: ${numberInRange}`);
      if (numberInRange >= minNumberInRange) {
        queueDetected2 = true;
      } else if (numberInRange <= (numberOfMeasurements - minNumberOutOfRange)) {
        queueDetected2 = false;
      }
  
      if (lastQueueState2 !== queueDetected2)
      {
          lastQueueState2 = queueDetected2;
          if (lastQueueState2) {
              print('Sensor 2 - People moved in range...');
              sendTelemetry(2, 1);
          } else {
            print('Sensor 2 - People moved out of range...');
            sendTelemetry(2, 0);
          }
      }
  });

  setInterval(() => {
      sensor1.trigger(); // send pulse
      sensor2.trigger(); // send pulse
  }, 500);
}

start();

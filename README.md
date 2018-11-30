# Innoexp4 IoT
## Our Goal 
*Make the lunch experience even more amazing than it already is.*

Before we know what to do we first need to measure stuff. We will create things with lots of sensors, whatever we come up with.

The things will see everything.
- Which door is opened or closed?
- Is there much activity is there around the salad bar?
- What’s the air quality around the tosti machine?
- ...and much more.

The  things are there to stay and they will gather tons of data. We can use it to analyze trends. ETL it. Use it for dashboards. Maybe for some AI to tell us what to do next…
## Getting started

### Sensors and actuators
The primary focus is on installing [sensors](https://en.wikipedia.org/wiki/Sensor) to gather information about the restaurant. Maybe we may also want to add an [actuator](https://en.wikipedia.org/wiki/Actuator) here and there. It should be OK, as long as we don't disturb people during ther lunch break. Have a look at the descriptions of the available [sensors](./docs/Sensors.md) and [actuators](./docs/Sensors.md). And again: `primary focus === sensors`!

### Microcontrollers
The sensors and actuators will be connected to [microcontrollers](https://en.wikipedia.org/wiki/Microcontroller). We will use boards with [ESP8266](https://en.wikipedia.org/wiki/ESP8266) and [ESP32](https://en.wikipedia.org/wiki/ESP32) microchips, from the company Espressif (https://www.espressif.com/). Feature of these chips, important for our project is built-in WiFi. 

We will program the microcontrollers. There are many options to do that. Last year, during [InnoExp2](https://github.com/rovale/Innoexp2), we used the [Arduino programming language](https://www.arduino.cc/reference/en/) and the [Arduino IDE](https://www.arduino.cc/en/main/software). This year we need to be even more productive and we want to focus on the functionality. Therefore we will opt for a gentle decline: [Espruino](https://en.wikipedia.org/wiki/Espruino). 

### Espruino
Espruino (https://www.espruino.com/) is an open source [JavaScript](https://en.wikipedia.org/wiki/JavaScript) interpreter for microcontrollers. It is designed for devices with small amounts of RAM. Espruino has dedicated boards, and it also runs on the [ESP8266](https://www.espruino.com/EspruinoESP8266) and [ESP32](https://www.espruino.com/ESP32). The web site contains a lot of documentation. The creator of Espruino, Gordon Williams, is also very helpful in the [forums](http://forum.espruino.com/). Although not every feature of the ESP32 is fully supported, for our goal Espruino seems to be a good fit. To get started with Espruino you first need to flash the Espruino firmware on the board. I already did this for most of our boards. When the firmware is in place the Espruino Web IDE can connect to the board.

### Espruino Web IDE
The Espruino Web IDE can be installed from the [chrome web store](https://chrome.google.com/webstore/detail/espruino-web-ide/bleoifhkdalbjfbobjackfdifdneehpo). The first time we have to connect the board using the USB connector, later, when we [connect the board to the WiFi](http://www.espruino.com/Reference#Wifi) network, we can remove the USB cable and we can program the board over WiFi. There are multiple [options](http://www.espruino.com/Saving) to run the program when the board starts, the option that works fine for me is the `Save on send` [option](http://www.espruino.com/Saving#save-on-send) `Direct to Flash`. The web site contains an extensive [API reference](http://www.espruino.com/Reference#software). I added some IoT related [examples](./src) to this workshop material.

### MQTT
[MQTT](https://en.wikipedia.org/wiki/MQTT) is the protocol of the Internet of Things. 

Highlights of the MQTT protocol:
- It's a publish /subscribe mechanism with a broker and multiple clients. Our microcontrollers will be clients.
- Publishers publish messages in topics. The topic can contain slashes to organize it. Example: `evision/restaurant/thing-id/telemetry/climate`.
- Subscribers subcribe to topics. They can subscribe to specific topics, and they can use wildcards. Example `evision/restaurant/+/telemetry/#`, where `+` is a one level wildcard and `#` is a multiple level wildcard.
- It has built in Quality of Service which provides a guarantee that messages are delived.
  - QoS 0 - At most once
  - QoS 1 - At least once
  - QoS 2 - Exactly once
- Option to publish retained messages. The broker will always keep that message and send it when a scubcriber subscribes to the topic. We will use this for our status messages (`online`, `offline`).
- It has a Last Will and Testament feature. When a client is ungracefully disconnected the server then the broker will send this message. We will use this to publish the status `offline`.

We will use the [mosquitto](https://mosquitto.org/) MQTT broker and we will install it on a [Raspberry Pi](https://www.raspberrypi.org/). 

#### Suggested references

## Exploring sensors with the Widora Air
### About the Widora Air:
- [Data sheet](http://wiki.widora.cn/_media/air-spec.pdf)
- Based on [ESP32](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf).
- Exposes all pins of the ESP32, see [pinout](./docs/pinouts/Widora%20Air).
- Continuously rebooting after flashing Espruino on a brand new board can be resolved first flash something using Arduino, then Espruino.
- The DAC pins do [not](http://forum.espruino.com/conversations/328147) work in Espruino.
- https://randomnerdtutorials.com/esp32-pinout-reference-gpios/


## Digital input and output with a Sonoff Basic
Demonstrates the usage of digital inputs ([button](https://www.espruino.com/Button)) and outputs (relays and onboard LED).
<br/><br/>
### MQTT `command` payloads:
 - `{"name": "blinkOn"}` - starts blinking the on-board LED.
 - `{"name": "blinkOff"}` - stops blinking the on-board LED. 
<br/><br/>
 - `{"name": "turnOn"}` - turns the relay on. 
 - `{"name": "turnOff"}` - turns the relay off. 
 - `{"name": "toggle"}` - toggles the relay. 
### Published `telemetry`, every 30 seconds:
``` json
{
  "freeMemory":640,
  "rssi":-64
}
```

### About the Sonoff Basic:
- It is a [Wifi smart switch](https://sonoff.itead.cc/en/products/sonoff/sonoff-basic).
- Based on [ESP8266](https://www.espressif.com/sites/default/files/documentation/0a-esp8266ex_datasheet_en.pdf).
- A hackable device, but does not expose all pins of the ESP8266, see [pinout](./docs/pinouts/Sonoff%20Basic)
- https://randomnerdtutorials.com/how-to-flash-a-custom-firmware-to-sonoff/
- The on-board LED is turned on with the value `false`(!).


## Analog input and output with an ESP-12E
Demonstrates the usage of analog inputs (a photo resistor = light sensor) and outputs (an LED which is being dimmed).
<br/><br/>
### MQTT `command` payloads:
 - `{"name": "blinkOn"}` - starts blinking the on-board LED.
 - `{"name": "blinkOff"}` - stops blinking the on-board LED. 
<br/><br/>
 - `{"name": "autoDimOn"}` - turns on auto dimming *(dimming of the LED based on the value of the light sensor)*. 
 - `{"name": "autoDimOff"}` - turns off auto dimming. 
 - `{"name": "dim", "value": 0.5}` - dims the LED with the provided value of 0 to 1. 

### Published `telemetry`, every 5 seconds:
``` json
{
  "freeMemory":640,
  "rssi":-64,
  "light":0.8251953125
}
```
About the ESP-12E
- Based on [ESP8266](https://www.espressif.com/sites/default/files/documentation/0a-esp8266ex_datasheet_en.pdf).
- Exposes all pins of the ESP8266, see [pinout](./docs/pinouts/ESP-12E).
- The on-board LED is turned on with the value `false`(!).
  
---
### Things to do
  - [ ] Setup a WiFi network, preferably dedicated for the project.
  - [ ] Setup an MQTT server.
  - [ ] Setup a database.
  - [ ] Setup one or more Node-red instances. They should use a GitHub repository.
    - [ ] Add flows to store `telemetry`, `status`, and `command` messages.
      - [ ] Add a timestamp
  - [ ] I did a test to see if a switch could be connected using a long network cable. It works, but does it also work for more complex modules like the DHT-22 (temperature, humidity) or HC-SR04 (ultrasonic sound sensor)?
    - http://www.home-automation-community.com/temperature-and-humidity-from-am2302-dht22-sensor-displayed-as-chart/
    - https://www.sparkfun.com/datasheets/Sensors/Temperature/DHT22.pdf
    -   https://www.tinytronics.nl/shop/nl/spanning-converters/level-converters/spi-i2c-uart-bi-directionele-logic-level-converter-4-kanaals

### Notes to self:
#### Troubleshooting
  - Error while uploading script: `Uncaught Error: Unable to find or create file` can be resoled by `require('Storage').eraseAll()`.
  - Code which causes the board not to respond can be erased by clearing all memory, see flashing folder.
  - Problems installing the prolific driver for the old FTDI cable can be [resolved](http://www.totalcardiagnostics.com/support/Knowledgebase/Article/View/92/20/prolific-usb-to-serial-fix-official-solution-to-code-10-error).
  - Reading the state of a digital pin with `digitalRead` does not always work when the pin is used as an output pin by `digitalWrite`, resolution: keep track of the current state using a variable.

#### Ideas
  - [ ] Alternative for uploading: https://www.npmjs.com/package/espruino
  - [ ] `analogWrite(D5, 0.5, { freq : 1 })` also blinks an LED.


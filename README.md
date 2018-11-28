# Innoexp4 IoT
## Exploring sensors with the Widora Air
### About the Widora Air:
- Based on [ESP32](TODO).
- Exposes all pins of the ESP32, see [pinout](./docs/pinouts/Widora%20Air).
- Continuously rebooting after flashing Espruino on a brand new board can be resolved first flash something using Arduino, then Espruino.
- The DAC pins do [not](TODO) work in Espruino.
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
- It is a [Wifi smart switch]( https://sonoff.itead.cc/en/products/sonoff/sonoff-basic).
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

### Notes to self:
#### Troubleshooting
  - Error while uploading script: `Uncaught Error: Unable to find or create file` can be resoled by `require('Storage').eraseAll()`.
  - Code which causes the board not to respond can be erased by clearing all memory, see flashing folder.
  - Problems installing the prolific driver for the old FTDI cable can be [resolved](http://www.totalcardiagnostics.com/support/Knowledgebase/Article/View/92/20/prolific-usb-to-serial-fix-official-solution-to-code-10-error).
  - Reading the state of a digital pin with `digitalRead` does not always work when the pin is used as an output pin by `digitalWrite`, resolution: keep track of the current state using a variable.

#### Ideas
  - [ ] Alternative for uploading: https://www.npmjs.com/package/espruino
  - [ ] `analogWrite(D5, 0.5, { freq : 1 })` also blinks an LED.
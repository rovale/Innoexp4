# Innoexp4 IoT
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
- A hackable device, but does not expose all pins of the ESP8266, see [pinout](./pinouts/Sonoff%20Basic)

### Notes to self:
- Reading the state of a digital pin with `digitalRead` does not always work when the pin is used as an output pin by `digitalWrite`, resolution: keep track of the current state using a variable.
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
- Exposes all pins of the ESP8266, see [pinout](./pinouts/ESP-12E).
  
---
### Notes to self:
- [ ] Error while uploading script: `Uncaught Error: Unable to find or create file` can be resoled by `require('Storage').eraseAll()`.
- [ ] Alternative for uploading: https://www.npmjs.com/package/espruino
- [ ] `analogWrite(D5, 0.5, { freq : 1 })` also blinks an LED.
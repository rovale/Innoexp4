# Things
Some example things.

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

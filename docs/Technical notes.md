# Technical notes

## Sensors and actuators

Available [sensors](../docs/Sensors.md) and [actuators](../docs/Sensors.md).

## Microcontrollers

### ESP8266

- [Data sheet](https://www.espressif.com/sites/default/files/documentation/0a-esp8266ex_datasheet_en.pdf).

#### - ESP-01

- Exposes only some pins of the ESP8266.
- [Data sheet](https://components101.com/wireless/esp8266-pinout-configuration-features-datasheet)

#### - ESP-12E (NodeMCU)

- Exposes all pins of the ESP8266.
- [Data sheet](https://components101.com/wireless/esp12e-pinout-datasheet)
- [Pinout](../docs/pinouts/ESP-12E)
- Random notes
  - The on-board LED is turned on with the value `false`(!).

#### - Sonoff Basic

- Its a [WiFi smart switch](https://sonoff.itead.cc/en/products/sonoff/sonoff-basic).
- Exposes only some pins of the ESP8266.
- [Pinout](../docs/pinouts/Sonoff%20Basic)
- Random notes
  - <https://randomnerdtutorials.com/how-to-flash-a-custom-firmware-to-sonoff/>
  - The on-board LED is turned on with the value `false`(!).

### ESP32

- [Data sheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf).
- Read [this](https://randomnerdtutorials.com/esp32-pinout-reference-gpios/)!

#### - Widora air

- Exposes all pins of the ESP32
- [Data sheet](http://wiki.widora.cn/_media/air-spec.pdf)
- [Pinout](../docs/pinouts/Widora%20Air).
- Random notes
  - [CP210x USB to UART Bridge VCP Drivers](https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers).
  - Continuously rebooting after flashing Espruino on a brand new board can be resolved first flash something using Arduino, then Espruino.
  - The DAC pins do [not](http://forum.espruino.com/conversations/328147) work in Espruino.

## Espruino

- The binaries and scripts to flash our boards are [here](../flashing).
- Random notes
  - The ESP-01 and Sonoff Basic need to connect to the PC with an [FTDI](https://en.wikipedia.org/wiki/FTDI) cable
  - The new [FTDI cable](https://www.tinytronics.nl/shop/en/communication/usb/ft232-3.3-5v-ttl-usb-serial-port-adapter-with-cable) is plug and play
  - Problems installing the prolific driver for the [old FTDI](https://www.tinytronics.nl/shop/en/communication/usb/pl2303hx-3.3v-5v-ttl-usb-serial-port-adapter-with-cable) cable can be [resolved](http://www.totalcardiagnostics.com/support/Knowledgebase/Article/View/92/20/prolific-usb-to-serial-fix-official-solution-to-code-10-error).

## Espruino Web IDE

- [API reference](http://www.espruino.com/Reference#software).
- I created some pretty useful [examples](../src).
- Espruino uses [modules](https://www.espruino.com/Modules). We can create a central place to host a `shared.js` module with settings that all things can use. I added a this to the 'Node-RED' story.
- There are multiple [options](http://www.espruino.com/Saving) to run the program when the board starts. The option that works fine for me is the `Save on send` [option](http://www.espruino.com/Saving#save-on-send) `Direct to Flash`.
- Random notes
  - Code which causes the board not to respond can be erased by clearing all memory, see [flashing](../flashing) folder.
  - Error while uploading script: `Uncaught Error: Unable to find or create file` can be resoled by `require('Storage').eraseAll()`.
  - Reading the state of a digital pin with `digitalRead` does not always work when the pin is used as an output pin by `digitalWrite`, resolution: keep track of the current state using a variable.
  - I prefer to edit code in Visual Studio Code, then I upload the code with the Espruino Web IDE. We can also use [this](https://www.npmjs.com/package/espruino). Did not have time to look into it.
  - Nice to try: `analogWrite(D5, 0.5, { freq : 1 })` also blinks an LED.

## Things

- I did a test to see if a switch could be connected using a long network cable. It works, but does it also work for more complex modules like the DHT-22 (temperature, humidity) or HC-SR04 (ultrasonic sound sensor)? Some references:
  - <http://www.home-automation-community.com/temperature-and-humidity-from-am2302-dht22-sensor-displayed-as-chart/>
  - <https://www.sparkfun.com/datasheets/Sensors/Temperature/DHT22.pdf>
  - <https://www.tinytronics.nl/shop/nl/spanning-converters/level-converters/spi-i2c-uart-bi-directionele-logic-level-converter-4-kanaals>

## MQTT

### MQTTLens

I run into a lay-out issue when the message payload is [JSON](https://en.wikipedia.org/wiki/JSON). Work around is making the window smaller. :-/

## Node-RED

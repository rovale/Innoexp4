# Stories

## Epic story: define the sensors
*Goal: explore what we will measure.*

Look around the restaurant.<br>
What would be interesting to measure?<br>
What do we want to know? What would the personnel like to know? <br>Discuss with people!

Examine the [sensors](./Sensors.md) we got.<br>
Or maybe hack an old electronic device, like a classic telephone for its sensors.<br>
Will it help if we use a combination of sensors to measure what we want to know?<br>
Discuss with nerds!

Think out of the box, be creative!

**Add stories for every idea.**

Define:
- [ ] What location? - *Examples: the door to the terrace, the salad bar, the toaster.*.
- [ ] What to measure? - *Example: is the door open or closed? What is the current temperature? What is the air quality?* 
- [ ] Which sensor(s) to use? - *Examples: the door switch, the temperature/humidity sensor (DHT-22), the air quality sensor (MQ-135)* 
- [ ] When to send the measurements? - *Examples: every time the door opens or closes. Every 5 minutes, around lunch time every 30 seconds*
- [ ] What should it look like? *Can we hide the sensor, maybe under the ceiling? If we can't hide it what should it look like? Can we make it look good? Is it safe for a restaurant? It should stay there for a while. Can we make it durable?*
- [ ] Are there other things to consider?
- [ ] Share your ideas!

**Spike the idea**

*Requires some basic knowledge about microcontrollers and wiring sensors. Ronald will give a short session about these topics*

Just do it!<br>
Look at the documentation of the sensor.<br>
Check if we already have similar sensors up and running.<br>
Google on the code of the sensor in conjunction with 'ESP8266' or 'ESP32'.<br>
Try to find examples on the Espruino site.<br>
There are a lot of examples on YouTube.<br>

Try to make it print the sensor data.

Some guidance... just to prevent damage:
- Unplug the microcontroller before changing wires.
- The color of wires
  - `+`, `vcc`, `5v`, `3.3v` is always red.
  - `-`, `gnd` is black, alternative is dark blue.
- The operating voltage of the pins is 3.3v. Don't provide a higher value.
- Maximum current per pin is 15mA.
- Before plugging it it, verify the wiring!

Some documentation
- [How to use a breadboard](https://learn.sparkfun.com/tutorials/how-to-use-a-breadboard)

Define:
- [ ] How to wire it up. *If it helps, make a simple drawing like [this](https://www.google.com/search?tbm=isch&as_q=fritzing).* 
- [ ] What pins are required. - *Examples: 1 digital output pin and 1 digital input pin, 1 analog pin.*
- [ ] What units will be used to report the sensor data? *Examples: raw analog value, degrees celsius, lux* 
- [ ] What will the JSON message be? *Example:*
``` json
{
  "temperature": 21.5,
  "humidity": 45.8
}
```
## Epic story: define the things
*Goal: create things which publish our sensor data.*

Examine the 'Sensor' stories. A microcontroller has quite some pins and it would be a waste if we only add one sensor to every microcontroller. Is it possible to add multiple sensors to one microcontroller?

Can we divide the restaurant in sections?

**Add stories for every thing.**

Define:
- [ ] How to name the thing?
- [ ] Where to put it? *Can we find a central place in between the sensors?*
- [ ] Which power outlet can we use? *Don't use outlets which are needed by people, we don't want our thing to be unplugged.*
- [ ] Do we need an extension cord?
- [ ] What sensors will it have? *Add references to the 'Sensor' stories.*
- [ ] How to connect the sensors? *If we need longer wiring cables, does that still work for our sensor? Test it! For the longer wires specify which colors are used for what purpose since they might not have red `+` or black `-`. Be careful!*
- [ ] What should it look like? *Can we hide it, maybe under the ceiling? If we can't hide it what should it look like? Can we make it look good? Is it safe for a restaurant? It should stay there for a while. Can we make it durable?*
- [ ] Are there other things to consider?
- [ ] Share your ideas!

Next to define:<br>
*Requires some basic knowledge about MQTT. Ronald will give a short session about this topic*
- [ ] Which topics will be used for publishing the sensor data? *Examples:* `evision/restaurant/thing-xyz/telemetry/toaster/air-quality`
`evision/restaurant/thing-xyz/telemetry/table1/presence`<br><br>
*Coordinate the topics names, we should have a topic name convention for all things. That will help when we are going to analyze the data.*

**Build the thing**

- [ ] Write the code. *Get some help from the code examples.*
- [ ] Create a PR for every 'Thing' story. *Beware it's a public repository: don't share any sensitive data, like passwords.*
- [ ] Deploy the code on the microcontroller.
- [ ] Test it!
- [ ] Install it in the physical location!

## Story: Prepare network infrastructure
- Prepare a WiFi network 
  - [ ] To be used by 
    - [ ] Our things
    - [ ] Our server
    - [ ] Our laptops
  - [ ] It should have internet access.
  - [ ] Can we use the existing WiFi infrastructure?
    - [ ] It is likely that we cannot secure our microcontrollers. *To be investigated.*
    - [ ] Would it help if we create a separate network for our things?
    - [ ] Maybe use a router with the guest network as WAN?
- [ ] What else to take into consideration?

## Story: Prepare a server
- [ ] Use a Raspberry PI 
- [ ] It should be close to the TV so whe can possibly project a real life dashboard.
- [ ] It should be in a safe place. *Can we put it under the ceiling?*
- [ ] It should have an external HDD for the data we will gather.
- [ ] What else to take into consideration?

## Story: Install Mosquitto MQTT server
- [ ] It should be installed on the Raspberry PI.
- [ ] It should have password protection, no SSL, default port 1883.
- [ ] It should start the service at startup.
- [ ] What else to take into consideration?

## Story: Install Node-RED
- [ ] It should be installed on the Raspberry PI.
- [ ] It should start the service at startup.
- [ ] It should have password protection, no SSL, default port 1880.
- [ ] It should use a GitHub repository for the flows.
- [ ] It should add a flow with an HTTP node which serves the settings of our things.
- [ ] What else to take into consideration?

## Story: Store the data
- [ ] Choose what database to use.
  - [ ] Consider how to cope with LOTS of data. *Maybe sharding / partitioning?*
- [ ] It should be installed on the Raspberry PI.
- [ ] Create a Node-RED flow to store all data published to the MQTT server:
  - [ ] `status` messages
  - [ ] `telemetry` messages
  - [ ] `command` messages
- [ ] It should store
  - [ ] A timestamp
  - [ ] The entire topic name
  - [ ] The JSON payload

## Enhancement story: Node-RED dashboard
- [ ] It should show the status of our things, online / offline.
- [ ] It should show some graphics of telemetry data.
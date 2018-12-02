# Stories

## Epic story: Sensors
**Goal: explore what we will measure.**

Look around the restaurant.
What would be interesting to measure?
What do we want to know? What would the personnel like to know? Discuss with people!

Examine the sensors we got. Or maybe hack an old electronic device (like a telephone) for its sensors. Will it help if we use a combination of sensors to measure what we want to know? Discuss with nerds!

Think out of the box, be creative!

**Add stories for every idea.**

Define:
- [ ] What location? - *Examples: the door to the terrace, the salad bar, the toaster.*.
- [ ] What to measure? - *Example: is the door open or closed? What is the current temperature? What is the air quality?* 
- [ ] Which sensor(s) to use? - *Examples: the door switch, the temperature/humidity sensor (DHT-22), the air quality sensor (MQ-135)* 
- [ ] When to send the measurements? - *Examples: every time the door opens or closes. Every 5 minutes, around lunch time every 30 seconds*
- [ ] What should it look like? *Can we hide the sensor, maybe under the ceiling? If we can't hide it what should it look like? Can we make it look good? Is it safe for a restaurant? It should stay there for a while. Can we make it durable?*
- [ ] Are there other things to consider?

**Spike it**

*Requires some basic knowledge about microcontrollers and wiring sensors. @rovale will give a short session to explain this a bit*

Just do it!
Look at the documentation of the sensor.
Google on the code of the sensor in conjunction with 'ESP8266' or 'ESP32'.
Try to find examples on the Espruino site.
There are a lot of examples on YouTube.

Some requirements just to prevent damage:
- [ ] Unplug the microcontroller before changing wires
- [ ] The pins of our microcontrollers provide 3.3 v
- [ ] The color of wires
  - [ ] + is always red
  - [ ] - is black, alternative is dark blue

Maybe interesting.
- [How to use a breadboard](https://learn.sparkfun.com/tutorials/how-to-use-a-breadboard) 


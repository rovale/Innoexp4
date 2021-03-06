#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "DHTesp.h"
#include <Wire.h>
#include <Adafruit_BMP085.h>

#include <ESPmDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>

#include <Secrets-oz.h>

const int ledPin = 5;

const int sdaPin = 21;
const int sclPin = 22;

const int lightPin = 36;
const int pirPin = 34;
const int dhtPin = 33;

const char mqttClientId[] = "tbl1";

const char commandTopic[] = "evision/restaurant/tbl1/command";

const char statusTopic[] = "evision/restaurant/tbl1/status";
const char systemTopic[] = "evision/restaurant/tbl1/telemetry/system";
const char climateTopic[] = "evision/restaurant/tbl1/telemetry/climate";
const char activityTopic[] = "evision/restaurant/tbl1/telemetry/activity";

WiFiClient wiFiClient;
PubSubClient client(wiFiClient);
DHTesp dht;
Adafruit_BMP085 bmp;

unsigned long reconnectDelay = 5000;
unsigned long lastReconnectAttemptAt = reconnectDelay * -1;
unsigned long lastSystemMessageAt = 0;
unsigned long lastTelemetryMessageAt = 0;

bool testPir = false;

void publish(const char *topic, String message, bool retain)
{
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(message);

  char messageCharArray[message.length() + 1];
  message.toCharArray(messageCharArray, message.length() + 1);

  if (!client.publish(topic, messageCharArray, retain))
  {
    Serial.println("Pubish failed, maybe check MQTT_MAX_PACKET_SIZE, patch PubSubClient.h.");
    Serial.println("https://pubsubclient.knolleary.net/api.html");
    Serial.print("Message length is ");
    Serial.println(message.length());
  }
}

void onReceive(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  for (int i = 0; i < length; i++)
  {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  DynamicJsonBuffer jsonBuffer(1024);
  JsonObject &root = jsonBuffer.parseObject(payload);
  if (root.success())
  {
    String commandName = root["name"];
    Serial.println(commandName);

    if (commandName == "testPirOn")
    {
      testPir = true;
    }
    else if (commandName == "testPirOff")
    {
      testPir = false;
      digitalWrite(ledPin, LOW);
    }
    else
    {
      Serial.println("Unknown command.");
    }
  }
  else
  {
    Serial.println("Unable to parse payload.");
  }
}

void turnLedOn()
{
  digitalWrite(ledPin, HIGH);
}

void turnLedOff()
{
  digitalWrite(ledPin, LOW);
}

String getStatusMessage(bool isOnline)
{
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject &jsonObject = jsonBuffer.createObject();
  jsonObject["online"] = isOnline;
  jsonObject["ip"] = WiFi.localIP().toString();
  String jsonString;
  jsonObject.printTo(jsonString);
  return jsonString;
}

String getOnlineStatusMessage()
{
  return getStatusMessage(true);
}

String getOfflineStatusMessage()
{
  return getStatusMessage(false);
}

void connect()
{
  unsigned long currentMillis = millis();

  if (!WiFi.isConnected())
  {
    delay(10);
    Serial.println();
    Serial.print("Connecting to the ");
    Serial.print(ssid);
    Serial.print(" network");

    WiFi.reconnect();
    while (!WiFi.isConnected())
    {
      delay(500);
      Serial.print(".");
    }

    Serial.println();
    Serial.print("Connected, ip ");
    Serial.println(WiFi.localIP());
  }

  if (currentMillis - lastReconnectAttemptAt >= reconnectDelay)
  {
    lastReconnectAttemptAt = currentMillis;

    Serial.print("Connecting to MQTT server ");
    Serial.println(mqttServer);

    String lastWill = getOfflineStatusMessage();
    char lastWillCharArray[lastWill.length() + 1];
    lastWill.toCharArray(lastWillCharArray, lastWill.length() + 1);

    if (client.connect(mqttClientId, statusTopic, 1, true, lastWillCharArray))
    //if (client.connect(mqttClientId, mqttUsername, mqttPassword, statusTopic, 1, true, lastWillCharArray))
    {
      turnLedOff();
      Serial.println("Connected");
      publish(statusTopic, getOnlineStatusMessage(), true);
      client.subscribe(commandTopic, 1);
    }
    else
    {
      Serial.print("Failed, state is ");
      Serial.println(client.state());
    }
  }
}

void setup()
{
  pinMode(ledPin, OUTPUT);
  pinMode(lightPin, INPUT);
  pinMode(pirPin, INPUT);
  //dht.setup(dhtPin, DHTesp::DHT22);

  Wire.begin(sdaPin, sclPin);
  //bmp.begin();

  turnLedOn();

  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, wiFiPassword, 0, NULL, false);
  client.setServer(mqttServer, 1883);
  client.setCallback(onReceive);

  ArduinoOTA.setPassword(otaPassword);
  ArduinoOTA
      .onStart([]() {
        Serial.println("Start updating");
      })
      .onEnd([]() {
        Serial.println("\nEnd");
      })
      .onProgress([](unsigned int progress, unsigned int total) {
        Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
      })
      .onError([](ota_error_t error) {
        Serial.printf("Error[%u]: ", error);
        if (error == OTA_AUTH_ERROR)
          Serial.println("Auth Failed");
        else if (error == OTA_BEGIN_ERROR)
          Serial.println("Begin Failed");
        else if (error == OTA_CONNECT_ERROR)
          Serial.println("Connect Failed");
        else if (error == OTA_RECEIVE_ERROR)
          Serial.println("Receive Failed");
        else if (error == OTA_END_ERROR)
          Serial.println("End Failed");
      });

  ArduinoOTA.begin();
}

String getSystemMessage()
{
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject &jsonObject = jsonBuffer.createObject();
  jsonObject["uptime"] = millis() / 1000;
  jsonObject["rssi"] = WiFi.RSSI();
  jsonObject["memory"] = ESP.getFreeHeap();
  String jsonString;
  jsonObject.printTo(jsonString);
  return jsonString;
}

String getClimateMessage()
{
  StaticJsonBuffer<400> jsonBuffer;
  JsonObject &jsonObject = jsonBuffer.createObject();
  jsonObject["light"] = (float)analogRead(lightPin) / 4096;

  ///TempAndHumidity dhtValues = dht.getTempAndHumidity();

  //jsonObject["humidity"] = dhtValues.humidity;
  //jsonObject["temperature"] = dhtValues.temperature;
  //jsonObject["temperature2"] = bmp.readTemperature();
  //jsonObject["pressure"] = bmp.readPressure();
  String jsonString;
  jsonObject.printTo(jsonString);
  return jsonString;
}

String getActivityMessage()
{
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject &jsonObject = jsonBuffer.createObject();
  jsonObject["presence"] = digitalRead(pirPin) == HIGH;

  String jsonString;
  jsonObject.printTo(jsonString);
  return jsonString;
}

void loop()
{
  unsigned long currentMillis = millis();

  if (!client.connected())
  {
    connect();
  }
  else
  {
    client.loop();

    if (currentMillis - lastSystemMessageAt >= 60000)
    {
      lastSystemMessageAt = currentMillis;
      publish(systemTopic, getSystemMessage(), false);
    }

    if (currentMillis - lastTelemetryMessageAt >= 30000)
    {
      lastTelemetryMessageAt = currentMillis;
      publish(climateTopic, getClimateMessage(), false);
      publish(activityTopic, getActivityMessage(), false);
    }
  }

  if (testPir)
  {
    digitalWrite(ledPin, digitalRead(pirPin));
  }

  ArduinoOTA.handle();
}

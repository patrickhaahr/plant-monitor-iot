#include <WiFi.h>
#include <HTTPClient.h>
#include "config.h" 

// Your server endpoint that accepts POST requests
const char* serverUrl = "http://192.168.1.14:5244/api/SensorData";

// Define the analog pin where the soil moisture sensor is connected
const int moistureSensorPin = 32;  

void setup() {
  Serial.begin(115200);
  delay(1000); // Give serial connection time to start

  // Connect to WiFi
  Serial.printf("\nConnecting to WiFi: %s\n", ssid);
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.printf("IP address: %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\nWiFi connection failed!");
  }
}

void loop() {
  // Read the analog value from the soil moisture sensor
  int moistureValue = analogRead(moistureSensorPin);
  Serial.printf("Soil moisture value: %d\n", moistureValue);

  // If WiFi is connected, send an HTTP POST request with the sensor data
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    Serial.printf("Connecting to server: %s\n", serverUrl);
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Create a JSON payload with the moisture data
    String jsonPayload = "{\"moisture\":" + String(moistureValue) + "}";
    Serial.printf("Sending payload: %s\n", jsonPayload.c_str());
    
    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.printf("HTTP Response code: %d\n", httpResponseCode);
      Serial.printf("Response: %s\n", response.c_str());
    } else {
      Serial.printf("Error sending data. Error: %s\n", http.errorToString(httpResponseCode).c_str());
    }
    
    http.end(); // Close the connection
  } else {
    Serial.println("WiFi disconnected. Attempting to reconnect...");
    WiFi.begin(ssid, password);
  }
  
  delay(5000);  // Wait 5 seconds before the next reading
}

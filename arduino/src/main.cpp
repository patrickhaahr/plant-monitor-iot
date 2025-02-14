#include <WiFi.h>
#include <HTTPClient.h>
#include "config.h" 

// Define the analog pin where the soil moisture sensor is connected
const int moistureSensorPin = 32;  
unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 6000; // 6 seconds for testing, adjust as needed

// Calibration values
const int AIR_VALUE = 4095;    // Value in air (dry)
const int WATER_VALUE = 1500;  // Value in water (wet)

// Function to get moisture percentage
int getMoisturePercentage(int rawValue) {
  // Convert to percentage (inverted because lower value means more moisture)
  int percentage = map(rawValue, AIR_VALUE, WATER_VALUE, 0, 100);
  // Constrain to 0-100 range
  return constrain(percentage, 0, 100);
}

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
  unsigned long currentTime = millis();
  
  // Only send data if enough time has passed
  if (currentTime - lastSendTime >= SEND_INTERVAL) {
    // Read the analog value from the soil moisture sensor
    int moistureValue = analogRead(moistureSensorPin);
    int moisturePercentage = getMoisturePercentage(moistureValue);
    
    Serial.printf("Raw moisture value: %d\n", moistureValue);
    Serial.printf("Moisture percentage: %d%%\n", moisturePercentage);
    
    if (moistureValue > 3000) {
      Serial.println("Status: Very Dry - Plant needs water!");
    } else if (moistureValue > 2200) {
      Serial.println("Status: Dry - Consider watering soon");
    } else if (moistureValue > 1800) {
      Serial.println("Status: Slightly Dry");
    } else if (moistureValue > 1400) {
      Serial.println("Status: Good Moisture Level");
    } else {
      Serial.println("Status: Very Wet");
    }

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
    
    lastSendTime = currentTime; // Update the last send time
  }
  
  delay(1000); // Small delay to prevent busy waiting
}

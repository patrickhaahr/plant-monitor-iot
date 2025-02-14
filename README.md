# Plant Monitor IoT

A full-stack IoT solution for monitoring plant soil moisture using Arduino, .NET Core backend, and React Native mobile app.

<div align="center">
  <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
    <img src="https://github.com/user-attachments/assets/2fed39ab-5e53-46ec-956e-6e8213e3c651" width="325" alt="Home Screen" />
    <img src="https://github.com/user-attachments/assets/7290776d-7c07-4826-996d-9b3d9d28d7ec" width="325" alt="Plant Dry Screen" />
    <img src="https://github.com/user-attachments/assets/0d0274d8-2b3f-4805-a68b-d8e7a3238e07" width="325" alt="Plant Details" />
    <img src="https://github.com/user-attachments/assets/ee73bcd8-a8de-4e02-9da8-67f08763d1e7" width="400" alt="Notification" />
  </div>
</div>

## Features

- Real-time soil moisture monitoring
- Mobile app with beautiful UI for viewing current and historical data
- Push notifications for low moisture levels
- Pull-to-refresh functionality
- Loading skeleton placeholders
- Automatic data refresh

## Tech Stack

- **Arduino**: ESP32 with soil moisture sensor
- **Backend**: .NET Core Web API with SQLite database
- **Mobile**: React Native (Expo) with TypeScript
- **Styling**: Tailwind CSS

## Setup Instructions

### Arduino Setup

1. Copy `arduino/src/config.template.h` to `arduino/src/config.h`
2. Update WiFi credentials and server URL in `config.h`
3. Upload code to ESP32 board and monitor serial output:

   You can use one of these methods:

   **Using PlatformIO CLI:**
   ```bash
   # Install PlatformIO CLI if not already installed
   pip install platformio

   # Build the project
   platformio run

   # Upload firmware to ESP32
   platformio run --target upload

   # Monitor serial output
   platformio device monitor
   ```

   **Using PlatformIO IDE Extension:**
   - Open project in VS Code with PlatformIO extension
   - Click Build button (✓) to compile
   - Click Upload button (→) to flash ESP32
   - Click Serial Monitor button to view output

   **Using Arduino IDE:**
   - Open `arduino/src/main.cpp` in Arduino IDE
   - Select "ESP32 Dev Module" from Tools > Board menu
   - Click Upload button to compile and flash
   - Open Serial Monitor (Tools > Serial Monitor) to view output


### Backend Setup

1. Install .NET 8.0 SDK
2. Navigate to `backend` directory
3. Run:
   ```bash
   # Restore NuGet package dependencies
   dotnet restore

   # Apply database migrations to create/update SQLite database
   dotnet ef database update

   # Start the development server
   dotnet run
   ```

### Mobile App Setup

1. Install Node.js and npm
2. Copy `mobile/.env.template` to `mobile/.env`
3. Update API URL in `.env`
4. Navigate to `mobile` directory
5. Run:
   ```bash
   # Install project dependencies
   npm install

   # Start the Expo development server
   npx expo start
   ```

## Environment Variables

> **Note:** For both Arduino and Mobile app, use your computer's IPv4 address instead of localhost (e.g., http://192.168.1.100:5000) since devices need to access the API over the local network.

### Arduino (`config.h`)
- `ssid`: WiFi network name
- `password`: WiFi password
- `serverUrl`: Backend API endpoint

### Mobile App (`.env`)
- `EXPO_PUBLIC_API_URL`: Backend API base URL

## Contributing

Feel free to open issues and pull requests!

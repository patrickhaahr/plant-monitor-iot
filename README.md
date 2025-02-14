# Plant Monitor IoT

A full-stack IoT solution for monitoring plant soil moisture using Arduino, .NET Core backend, and React Native mobile app.

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
   ```bash
   pio run -t upload
   pio device monitor
   ```


### Backend Setup

1. Install .NET 8.0 SDK
2. Navigate to `backend` directory
3. Run:
   ```bash
   dotnet restore
   dotnet ef database update
   dotnet run
   ```

### Mobile App Setup

1. Install Node.js and npm
2. Copy `mobile/.env.template` to `mobile/.env`
3. Update API URL in `.env`
4. Navigate to `mobile` directory
5. Run:
   ```bash
   npm install
   npx expo start
   ```

## Environment Variables

### Arduino (`config.h`)
- `ssid`: WiFi network name
- `password`: WiFi password
- `serverUrl`: Backend API endpoint

### Mobile App (`.env`)
- `EXPO_PUBLIC_API_URL`: Backend API base URL

## Contributing

Feel free to open issues and pull requests!
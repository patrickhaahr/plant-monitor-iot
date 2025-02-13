# Plant Project

A full-stack IoT project for plant monitoring using Arduino, .NET Web API, and React Native.

## Project Structure
- `/arduino` - Arduino/PlatformIO code for sensors
- `/backend` - .NET 8 Web API
- `/mobile` - React Native Expo mobile app

## Development Setup

### Arduino Setup (PlatformIO)
```bash
cd arduino

# Build and upload to device
pio run -t upload

# Monitor serial output
pio device monitor
```

### Backend (.NET 8 Web API)
```bash
cd backend

# Restore dependencies
dotnet restore

# Build and run the API
dotnet run

# Access Swagger UI
start http://localhost:5244/swagger

# Database Commands
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Mobile App (React Native Expo)
```bash
cd mobile

# Install dependencies
npm install

# Start development server
npx expo start
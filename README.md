# Football Dashboard

A football data dashboard using Footystats API to display today's matches and team statistics.

## Quick Start (Windows)

1. **Install Dependencies**
   - Double-click `install.bat`
   - Wait for installation to complete

2. **Start Server**
   - Double-click `start.bat`
   - Open browser and go to: http://localhost:12000

## Manual Installation

If the bat files don't work:

```cmd
# Install dependencies
npm install

# Start server
npm start
```

## Requirements

- Node.js 14+ (Download from https://nodejs.org/)
- Internet connection

## Features

- Real-time football matches
- Team statistics (overall + last 6 games)
- 1700+ leagues supported
- Mobile-friendly design

## API

This project uses Footystats API with a pre-configured API key.

## Troubleshooting

- **Port 12000 busy**: Use `set PORT=3000 && npm start`
- **Install fails**: Run `npm cache clean --force` then `npm install`
- **No data**: Check internet connection

## Access from Phone

1. Make sure phone and computer are on same WiFi
2. Find your computer's IP address: `ipconfig`
3. Open browser on phone: `http://YOUR_IP:12000`
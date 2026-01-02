# Quick Start Guide

## 🚀 Get Started in 2 Commands

```bash
make setup    # First time only
make run      # Start the application
```

That's it! Open http://localhost:3000

## 📋 What You Get

- ✈️ **Flight Search Engine** with real-time Amadeus data
- 🎨 **Beautiful UI** - Modern, responsive design
- 🔍 **Smart Search** - Airport autocomplete
- 🎯 **Filters** - Direct flights, budget range
- 📊 **Sorting** - By price, duration, time

## 🛠️ Useful Commands

```bash
make help       # Show all commands
make backend    # Start backend only
make frontend   # Start frontend only
make stop       # Stop everything
make restart    # Restart everything
make check      # Check dependencies
make info       # Show project info
```

## 🔧 Configuration

Edit `appsettings.json` with your Amadeus API keys:
```json
{
  "AmadeusApi": {
    "ClientId": "YOUR_CLIENT_ID",
    "ClientSecret": "YOUR_CLIENT_SECRET"
  }
}
```

## 📖 Full Documentation

See [README.md](../README.md) for complete documentation.


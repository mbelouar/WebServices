# Moteur de Recherche de Vols

Application web de recherche de vols développée avec .NET 10 et l'API Amadeus.

## Fonctionnalités

- Recherche de vols (aller-retour / aller simple)
- Autocomplétion des villes et aéroports
- Filtres : vols directs, horaires, prix maximum
- Tri : prix, durée, heure de départ
- Modification des informations de vol

## Installation

### Prérequis
- .NET 10.0 SDK
- Compte Amadeus Developer (https://developers.amadeus.com/)

### Configuration

1. Obtenez vos clés API Amadeus
2. Configurez `appsettings.json` :
```json
{
  "AmadeusApi": {
    "ClientId": "VOTRE_CLIENT_ID",
    "ClientSecret": "VOTRE_CLIENT_SECRET"
  }
}
```

### Lancement

```bash
dotnet restore
dotnet run
```

L'application sera accessible sur : **http://localhost:5000**

## Structure du Projet

```
WebServices/
├── Controllers/          # API endpoints
├── Services/             # Logique métier
├── Models/               # Modèles de données
├── wwwroot/              # Frontend (HTML/CSS/JS)
└── Program.cs            # Point d'entrée
```

## API Endpoints

- `POST /api/flights/search` - Recherche de vols
- `POST /api/flights/search-with-filters` - Recherche avec filtres et tri
- `GET /api/flights/locations?keyword=xxx` - Autocomplétion des villes

## Technologies

- Backend: .NET 10, ASP.NET Core Web API, C#
- Frontend: HTML5, CSS3, JavaScript
- API: Amadeus for Developers

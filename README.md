# Flight Search Engine ✈️

Application web de recherche de vols développée avec .NET 10 et Next.js, intégrant l'API Amadeus pour des données de vols en temps réel.

## 🚀 Démarrage Rapide

### Prérequis
- .NET 10.0 SDK
- Node.js 18+ et pnpm
- Compte Amadeus Developer (https://developers.amadeus.com/)

### Installation et Lancement

**Option 1: Avec Makefile (Recommandé)**
```bash
make setup    # Installation initiale (une seule fois)
make run      # Démarrer l'application
```

**Option 2: Manuel**
```bash
# Backend (.NET)
cd /Users/mohammedbelouarraq/Desktop/WebServices
dotnet restore
dotnet run

# Frontend (Next.js) - Dans un nouveau terminal
cd /Users/mohammedbelouarraq/Desktop/WebServices/flight-search-engine
pnpm install
pnpm dev
```

### URLs d'accès
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger

## ⚙️ Configuration

### 1. Clés API Amadeus

Modifiez `appsettings.json` avec vos clés:
```json
{
  "AmadeusApi": {
    "BaseUrl": "https://test.api.amadeus.com",
    "ClientId": "VOTRE_CLIENT_ID",
    "ClientSecret": "VOTRE_CLIENT_SECRET"
  }
}
```

### 2. URL de l'API (Frontend)

Le fichier `.env.local` est déjà configuré:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📋 Fonctionnalités

### Recherche de Vols
- ✈️ Vols aller-retour et aller simple
- 👥 1 à 9 passagers
- 🎫 Toutes les classes (Economy, Premium, Business, First)
- 📅 Sélection de dates avec calendrier

### Autocomplétion Intelligente
- 🔍 Recherche d'aéroports et villes en temps réel
- 🌍 Codes IATA, noms complets, pays
- ⚡ Recherche optimisée (debounce 300ms)

### Filtres Avancés
- 🎯 Vols directs uniquement
- 💰 Fourchette de budget (0-3000$)
- 🔄 Filtrage instantané côté client

### Options de Tri
- 💵 Prix (croissant/décroissant)
- ⏱️ Durée (plus court/plus long)
- 🕐 Heure de départ (tôt/tard)

### Modification de Vols
- ✏️ Modifier le prix
- 🪑 Modifier les sièges disponibles
- 🎫 Changer la classe
- 💾 Modifications en mémoire

## 🏗️ Structure du Projet

```
WebServices/
├── Controllers/              # Endpoints API
│   └── FlightsController.cs
├── Services/                 # Logique métier
│   ├── AmadeusService.cs    # Client API Amadeus
│   └── FlightService.cs     # Service de vols
├── Models/                   # Modèles de données
│   ├── FlightSearchRequest.cs
│   ├── FlightSearchResponse.cs
│   └── FlightOffer.cs
├── flight-search-engine/     # Frontend Next.js
│   ├── app/
│   │   ├── page.tsx         # Page principale
│   │   └── layout.tsx       # Layout & métadonnées
│   ├── components/
│   │   ├── flight-card.tsx  # Carte de vol
│   │   └── flight-search-form.tsx
│   └── lib/
│       ├── api.ts           # Client API
│       └── types.ts         # Types TypeScript
├── appsettings.json          # Configuration API
├── Program.cs                # Point d'entrée
├── Makefile                  # Commandes simplifiées
└── README.md                 # Ce fichier
```

## 🔌 API Endpoints

### Backend (.NET)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/flights/search` | Recherche simple de vols |
| POST | `/api/flights/search-with-filters` | Recherche avec filtres et tri |
| GET | `/api/flights/locations?keyword=xxx` | Autocomplétion des villes/aéroports |

### Exemple de Requête

```bash
curl -X POST http://localhost:5000/api/flights/search-with-filters \
  -H "Content-Type: application/json" \
  -d '{
    "searchRequest": {
      "originLocationCode": "CDG",
      "destinationLocationCode": "JFK",
      "departureDate": "2026-06-01",
      "adults": 1,
      "travelClass": "ECONOMY"
    },
    "filterOptions": {
      "directFlightsOnly": true
    },
    "sortBy": "price_asc"
  }'
```

## 🛠️ Commandes Makefile

```bash
make setup          # Installation complète (backend + frontend)
make run            # Démarrer backend + frontend
make backend        # Démarrer uniquement le backend
make frontend       # Démarrer uniquement le frontend
make build          # Build backend + frontend
make clean          # Nettoyer les fichiers de build
make help           # Afficher l'aide
```

## 🎨 Technologies Utilisées

### Backend
- **.NET 10.0** - Framework
- **ASP.NET Core Web API** - API REST
- **Swashbuckle** - Documentation Swagger
- **Newtonsoft.Json** - Sérialisation JSON
- **HttpClient** - Requêtes HTTP vers Amadeus

### Frontend
- **Next.js 15** - Framework React
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles utilitaires
- **shadcn/ui** - Composants UI
- **Lucide Icons** - Icônes
- **date-fns** - Manipulation de dates
- **Sonner** - Notifications toast

### API Externe
- **Amadeus for Developers** - Données de vols en temps réel

## 🔐 Sécurité

- ✅ Clés API stockées côté serveur uniquement
- ✅ CORS configuré pour origines spécifiques
- ✅ Validation des entrées utilisateur
- ✅ Gestion des erreurs sans exposition de données sensibles
- ✅ OAuth2 pour l'authentification Amadeus

## 🧪 Test de l'Application

1. **Démarrer l'application**: `make run`
2. **Ouvrir le navigateur**: http://localhost:3000
3. **Rechercher un vol**:
   - Origine: CDG (Paris)
   - Destination: JFK (New York)
   - Date de départ: Date future
   - Cliquer sur "Search Flights"
4. **Tester les filtres**:
   - Cocher "Direct flights only"
   - Ajuster le slider de budget
5. **Tester le tri**: Utiliser le menu déroulant
6. **Modifier un vol**: Cliquer sur "Modify"

## 🐛 Dépannage

### Le backend ne démarre pas
```bash
# Vérifier la version de .NET
dotnet --version  # Doit être 10.0+

# Restaurer les packages
dotnet restore
```

### Le frontend ne démarre pas
```bash
# Installer pnpm si nécessaire
npm install -g pnpm

# Réinstaller les dépendances
cd flight-search-engine
rm -rf node_modules
pnpm install
```

### Pas de résultats de recherche
- ✅ Vérifier que les deux services sont démarrés
- ✅ Vérifier les clés API dans `appsettings.json`
- ✅ Utiliser des codes IATA valides (CDG, JFK, LHR, etc.)
- ✅ Sélectionner des dates futures
- ✅ Consulter la console du navigateur pour les erreurs

### Erreurs CORS
- ✅ Backend doit être sur le port 5000
- ✅ Frontend doit être sur le port 3000
- ✅ CORS est déjà configuré dans `Program.cs`

## 📝 Notes de Développement

### Architecture
- **Backend**: API REST suivant les principes SOLID
- **Frontend**: Architecture composants React avec hooks
- **Communication**: HTTP/JSON entre frontend et backend
- **État**: Gestion avec React hooks (useState, useMemo)
- **Styling**: Tailwind CSS avec design system cohérent

### Améliorations Futures Possibles
- Authentification utilisateur
- Sauvegarde des vols favoris
- Réservation de vols
- Alertes de prix
- Vols multi-destinations
- Intégration hôtels et voitures

## 📄 Licence

Projet académique - Module .NET

## 👤 Auteur

Développé dans le cadre du module .NET

---

**Pour démarrer rapidement**: `make setup && make run`

**Besoin d'aide?** Consultez la section Dépannage ci-dessus.

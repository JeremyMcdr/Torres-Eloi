# Dashboard KPI Commercial

Ce dashboard permet de visualiser les données commerciales (CA et objectifs) stockées dans une base de données SQL Server.

## Fonctionnalités

- Affichage des statistiques clés (CA total, objectif total, CA moyen, performance)
- Graphique d'évolution du CA et des objectifs par année
- Graphique de performance (CA vs Objectif)
- Tableau détaillé des données
- Filtrage des données par année

## Configuration

1. Installez les dépendances :
   ```
   npm install
   ```

2. Assurez-vous que l'API est en cours d'exécution sur le port 3001 (ou modifiez l'URL de l'API dans `src/api/kpiService.js`).

## Démarrage

Pour démarrer l'application en mode développement :
```
npm start
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Construction pour la production

Pour construire l'application pour la production :
```
npm run build
```

Les fichiers de production seront générés dans le dossier `build`.

## Structure du projet

- `src/api/kpiService.js` : Service pour communiquer avec l'API
- `src/components/` : Composants React pour le dashboard
  - `StatCard.js` : Carte de statistique
  - `YearlyChart.js` : Graphique d'évolution par année
  - `PerformanceChart.js` : Graphique de performance
  - `DataTable.js` : Tableau de données
- `src/App.js` : Composant principal qui intègre tous les composants 
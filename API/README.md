# API KPI Dashboard (Mode fichier XLS)

Cette API permet d'accéder aux données KPI stockées dans un fichier XLS.

## Configuration

1. Installez les dépendances :
   ```
   npm install
   ```

2. Assurez-vous que le fichier XLS `export_bdd_objectif_comm.xls` est présent à la racine du projet.

## Démarrage

Pour démarrer le serveur en mode développement :
```
npm run dev
```

Pour démarrer le serveur en mode production :
```
npm start
```

## Endpoints disponibles

- `GET /api/kpi/data` : Récupère toutes les données KPI
- `GET /api/kpi/data/by-year` : Récupère les données agrégées par année
- `GET /api/kpi/data/year/:year` : Récupère les données pour une année spécifique
- `GET /api/kpi/stats` : Récupère les statistiques globales (total CA, objectifs, etc.)

## Structure des données

Les données sont structurées selon le schéma suivant :
- ID : Identifiant unique
- COM_ANNEE : Année commerciale
- CA : Chiffre d'affaires
- COM_OBJ : Objectif commercial

## Passage à SQL Server

Lorsque votre base de données SQL Server sera prête, vous pourrez facilement migrer cette API pour l'utiliser au lieu du fichier XLS. Les endpoints resteront les mêmes, seule la source de données changera. 
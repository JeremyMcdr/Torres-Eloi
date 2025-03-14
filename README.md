# Projet Dashboard KPI Commercial

Ce projet comprend une API et un dashboard pour visualiser les données commerciales (CA et objectifs) stockées dans un fichier XLS (temporairement, en attendant la mise en place de la base de données SQL Server).

## Structure du projet

Le projet est divisé en deux parties principales :

- **API** : Une API Node.js/Express qui lit un fichier XLS et expose les données
- **DASHBOARD** : Une application React qui consomme l'API et affiche les données de manière visuelle

## Configuration et démarrage

### Configuration du fichier XLS

Assurez-vous que le fichier XLS `export_bdd_objectif_comm.xls` est présent à la racine du projet. Ce fichier doit contenir les colonnes suivantes :
- ID
- COM_ANNEE
- CA
- COM_OBJ

### Démarrage de l'API

1. Accédez au dossier API :
   ```
   cd API
   ```

2. Installez les dépendances :
   ```
   npm install
   ```

3. Démarrez l'API :
   ```
   npm start
   ```

L'API sera accessible à l'adresse [http://localhost:3001](http://localhost:3001).

### Démarrage du Dashboard

1. Accédez au dossier DASHBOARD :
   ```
   cd DASHBOARD
   ```

2. Installez les dépendances :
   ```
   npm install
   ```

3. Démarrez le dashboard :
   ```
   npm start
   ```

Le dashboard sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Structure des données

Le dashboard est conçu pour fonctionner avec des données ayant la structure suivante :

- **ID** : Identifiant unique
- **COM_ANNEE** : Année commerciale
- **CA** : Chiffre d'affaires
- **COM_OBJ** : Objectif commercial

## Fonctionnalités du Dashboard

- Affichage des statistiques clés (CA total, objectif total, CA moyen, performance)
- Graphique d'évolution du CA et des objectifs par année
- Graphique de performance (CA vs Objectif)
- Tableau détaillé des données
- Filtrage des données par année

## Endpoints de l'API

- `GET /api/kpi/data` : Récupère toutes les données KPI
- `GET /api/kpi/data/by-year` : Récupère les données agrégées par année
- `GET /api/kpi/data/year/:year` : Récupère les données pour une année spécifique
- `GET /api/kpi/stats` : Récupère les statistiques globales (total CA, objectifs, etc.)

## Migration vers SQL Server

Lorsque votre base de données SQL Server sera prête, vous pourrez facilement migrer l'API pour l'utiliser au lieu du fichier XLS. Les endpoints resteront les mêmes, seule la source de données changera. Les fichiers nécessaires pour la connexion à SQL Server sont déjà inclus dans le projet (commentés). 
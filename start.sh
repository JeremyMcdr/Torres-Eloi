#!/bin/bash

echo "==================================================="
echo "  Démarrage du Dashboard KPI Commercial"
echo "==================================================="
echo ""
echo "Ce script va démarrer l'API et le dashboard."
echo "Assurez-vous que SQL Server est en cours d'exécution"
echo "et que les informations de connexion sont correctes dans API/.env"
echo ""
echo "Vérification de la configuration..."

if [ ! -f "API/.env" ]; then
  echo "ATTENTION: Le fichier API/.env n'a pas été trouvé!"
  echo "Création d'un fichier .env par défaut..."
  
  cat > API/.env << EOL
# Configuration de la base de données SQL Server
DB_USER=sa
DB_PASSWORD=YourPassword123
DB_SERVER=localhost
DB_DATABASE=KPI_Commercial

# Configuration du serveur
PORT=3001
EOL
  
  echo "Fichier .env créé avec des valeurs par défaut."
  echo "Veuillez modifier ce fichier avec vos informations de connexion réelles."
else
  echo "Fichier de configuration .env trouvé!"
fi

# Démarrer l'API
echo ""
echo "Démarrage de l'API..."
cd API
npm install
echo ""
echo "Test de la connexion à SQL Server..."
node scripts/testConnection.js
echo ""
echo "Démarrage du serveur API..."
npm start &
API_PID=$!

# Attendre que l'API soit démarrée
echo ""
echo "Attente du démarrage de l'API..."
sleep 5

# Démarrer le dashboard
echo ""
echo "Démarrage du dashboard..."
cd ../DASHBOARD
npm install
npm start &
DASHBOARD_PID=$!

# Fonction pour arrêter les processus lors de la fermeture
function cleanup {
  echo ""
  echo "Arrêt des processus..."
  kill $API_PID
  kill $DASHBOARD_PID
  exit
}

# Capturer les signaux d'arrêt
trap cleanup SIGINT SIGTERM

# Garder le script en cours d'exécution
echo ""
echo "==================================================="
echo "  Dashboard KPI Commercial est en cours d'exécution"
echo "==================================================="
echo ""
echo "L'API est accessible sur http://localhost:3001"
echo "Le dashboard est accessible sur http://localhost:3000"
echo ""
echo "Si vous rencontrez des erreurs:"
echo "1. Vérifiez que SQL Server est en cours d'exécution"
echo "2. Vérifiez que les informations de connexion dans API/.env sont correctes"
echo "3. Vérifiez les logs de l'API pour plus d'informations"
echo "4. Consultez les informations de débogage sur le dashboard"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les deux serveurs."
wait 
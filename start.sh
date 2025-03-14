#!/bin/bash

echo "==================================================="
echo "  Démarrage du Dashboard KPI Commercial"
echo "==================================================="
echo ""
echo "Ce script va démarrer l'API et le dashboard."
echo "Assurez-vous que le fichier export_bdd_objectif_comm.xls"
echo "est présent à la racine du projet."
echo ""
echo "Vérification du fichier XLS..."

if [ ! -f "export_bdd_objectif_comm.xls" ]; then
  echo "ERREUR: Le fichier export_bdd_objectif_comm.xls n'a pas été trouvé!"
  echo "Veuillez placer le fichier à la racine du projet et réessayer."
  exit 1
else
  echo "Fichier XLS trouvé!"
fi

# Démarrer l'API
echo ""
echo "Démarrage de l'API..."
cd API
npm install
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
echo "1. Vérifiez que le fichier XLS est au bon format"
echo "2. Vérifiez les logs de l'API pour plus d'informations"
echo "3. Consultez les informations de débogage sur le dashboard"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les deux serveurs."
wait 
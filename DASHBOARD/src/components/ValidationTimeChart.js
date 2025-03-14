import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ValidationTimeChart = ({ data, commercialId }) => {
  // Pour l'instant, nous allons simuler des données de temps de validation
  // Dans une implémentation réelle, ces données viendraient de l'API
  
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>Temps de validation des commandes</h3>
        <p>Aucune donnée disponible pour ce commercial.</p>
      </div>
    );
  }

  // Regrouper les données par année
  const yearlyData = {};
  
  // Simuler des temps de validation basés sur les données existantes
  data.forEach(item => {
    if (!item.COM_ANNEE) return;
    
    const year = item.COM_ANNEE;
    if (!yearlyData[year]) {
      yearlyData[year] = {
        year,
        // Simuler un temps de validation entre 1 et 10 jours
        // Dans une implémentation réelle, ce serait une vraie donnée
        validationTime: Math.floor(Math.random() * 10) + 1,
        nbCommandes: 1
      };
    } else {
      // Ajouter une commande et calculer la moyenne
      yearlyData[year].nbCommandes += 1;
      // Simuler un nouveau temps aléatoire pour cette commande
      const newTime = Math.floor(Math.random() * 10) + 1;
      // Calculer la moyenne pondérée
      yearlyData[year].validationTime = 
        (yearlyData[year].validationTime * (yearlyData[year].nbCommandes - 1) + newTime) / 
        yearlyData[year].nbCommandes;
    }
  });
  
  // Convertir en tableau et trier par année
  const chartData = Object.values(yearlyData).sort((a, b) => a.year - b.year);
  
  if (chartData.length === 0) {
    return (
      <div className="chart-container">
        <h3>Temps de validation des commandes</h3>
        <p>Aucune donnée annuelle disponible pour ce commercial.</p>
      </div>
    );
  }

  // Récupérer le nom du commercial
  const commercialName = data[0]?.COM_NOM || `Commercial ${commercialId}`;

  // Préparer les données pour le graphique
  const barData = {
    labels: chartData.map(item => item.year),
    datasets: [
      {
        label: 'Temps moyen de validation (jours)',
        data: chartData.map(item => item.validationTime.toFixed(1)),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  // Options du graphique
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' jours';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Jours'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Année'
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <h3>Temps de validation des commandes - {commercialName}</h3>
      <div style={{ height: '400px' }}>
        <Bar data={barData} options={barOptions} />
      </div>
      <div className="performance-summary">
        <p>Ce graphique montre le temps moyen de validation des commandes par année pour {commercialName}.</p>
        <p><strong>Note:</strong> Ces données sont simulées à des fins de démonstration. Dans une implémentation réelle, elles proviendraient de l'API.</p>
        <table className="validation-time-table">
          <thead>
            <tr>
              <th>Année</th>
              <th>Temps moyen (jours)</th>
              <th>Nombre de commandes</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map(item => (
              <tr key={item.year}>
                <td>{item.year}</td>
                <td>{item.validationTime.toFixed(1)}</td>
                <td>{item.nbCommandes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ValidationTimeChart; 
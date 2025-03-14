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

const GlobalValidationTimeChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>Temps de validation global des commandes</h3>
        <p>Aucune donnée disponible.</p>
      </div>
    );
  }

  // Regrouper les données par commercial et par année
  const commercialData = {};
  
  // Simuler des temps de validation basés sur les données existantes
  data.forEach(item => {
    if (!item.COM_ANNEE || !item.ID) return;
    
    const commercialId = item.ID;
    const year = item.COM_ANNEE;
    
    if (!commercialData[commercialId]) {
      commercialData[commercialId] = {
        id: commercialId,
        name: item.COM_NOM || `Commercial ${commercialId}`,
        years: {}
      };
    }
    
    if (!commercialData[commercialId].years[year]) {
      commercialData[commercialId].years[year] = {
        // Simuler un temps de validation entre 1 et 10 jours
        validationTime: Math.floor(Math.random() * 10) + 1,
        nbCommandes: 1
      };
    } else {
      // Ajouter une commande et calculer la moyenne
      commercialData[commercialId].years[year].nbCommandes += 1;
      // Simuler un nouveau temps aléatoire pour cette commande
      const newTime = Math.floor(Math.random() * 10) + 1;
      // Calculer la moyenne pondérée
      commercialData[commercialId].years[year].validationTime = 
        (commercialData[commercialId].years[year].validationTime * 
          (commercialData[commercialId].years[year].nbCommandes - 1) + newTime) / 
        commercialData[commercialId].years[year].nbCommandes;
    }
  });
  
  // Extraire les années uniques
  const years = [...new Set(data.map(item => item.COM_ANNEE).filter(Boolean))].sort();
  
  // Préparer les données pour le graphique
  const datasets = Object.values(commercialData).map(commercial => {
    // Générer une couleur aléatoire pour chaque commercial
    const r = Math.floor(Math.random() * 200) + 55;
    const g = Math.floor(Math.random() * 200) + 55;
    const b = Math.floor(Math.random() * 200) + 55;
    
    return {
      label: commercial.name,
      data: years.map(year => {
        if (commercial.years[year]) {
          return commercial.years[year].validationTime.toFixed(1);
        }
        return 0;
      }),
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.7)`,
      borderColor: `rgba(${r}, ${g}, ${b}, 1)`,
      borderWidth: 1
    };
  });
  
  const barData = {
    labels: years,
    datasets
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

  // Calculer les moyennes globales par année
  const globalAverages = years.map(year => {
    let totalTime = 0;
    let totalCommandes = 0;
    
    Object.values(commercialData).forEach(commercial => {
      if (commercial.years[year]) {
        totalTime += commercial.years[year].validationTime * commercial.years[year].nbCommandes;
        totalCommandes += commercial.years[year].nbCommandes;
      }
    });
    
    return {
      year,
      averageTime: totalCommandes > 0 ? totalTime / totalCommandes : 0,
      totalCommandes
    };
  });

  return (
    <div className="chart-container">
      <h3>Temps de validation des commandes par commercial et par année</h3>
      <div style={{ height: '400px' }}>
        <Bar data={barData} options={barOptions} />
      </div>
      <div className="performance-summary">
        <p>Ce graphique montre le temps moyen de validation des commandes par commercial et par année.</p>
        <p><strong>Note:</strong> Ces données sont simulées à des fins de démonstration. Dans une implémentation réelle, elles proviendraient de l'API.</p>
        
        <h4>Moyennes globales par année</h4>
        <table className="validation-time-table">
          <thead>
            <tr>
              <th>Année</th>
              <th>Temps moyen global (jours)</th>
              <th>Nombre total de commandes</th>
            </tr>
          </thead>
          <tbody>
            {globalAverages.map(item => (
              <tr key={item.year}>
                <td>{item.year}</td>
                <td>{item.averageTime.toFixed(1)}</td>
                <td>{item.totalCommandes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GlobalValidationTimeChart; 
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

const CommercialChart = ({ data, commercialId }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>Performance du commercial</h3>
        <p>Aucune donnée disponible pour ce commercial.</p>
      </div>
    );
  }

  // Regrouper les données par année
  const yearlyData = {};
  
  data.forEach(item => {
    if (!item.COM_ANNEE) return;
    
    const year = item.COM_ANNEE;
    if (!yearlyData[year]) {
      yearlyData[year] = {
        year,
        ca: 0,
        objectif: 0
      };
    }
    
    yearlyData[year].ca += item.CA || 0;
    yearlyData[year].objectif += item.COM_OBJ || 0;
  });
  
  // Convertir en tableau et trier par année
  const chartData = Object.values(yearlyData).sort((a, b) => a.year - b.year);
  
  if (chartData.length === 0) {
    return (
      <div className="chart-container">
        <h3>Performance du commercial</h3>
        <p>Aucune donnée annuelle disponible pour ce commercial.</p>
      </div>
    );
  }

  // Calculer la performance globale
  const totalCA = chartData.reduce((sum, item) => sum + item.ca, 0);
  const totalObjectif = chartData.reduce((sum, item) => sum + item.objectif, 0);
  const overallPerformance = totalObjectif > 0 ? (totalCA / totalObjectif) * 100 : 0;
  
  // Déterminer la couleur de l'indicateur de performance
  let performanceColor = '#dc3545'; // Rouge par défaut (< 80%)
  if (overallPerformance >= 100) {
    performanceColor = '#28a745'; // Vert (>= 100%)
  } else if (overallPerformance >= 80) {
    performanceColor = '#ffc107'; // Jaune (>= 80%)
  }

  // Préparer les données pour le graphique
  const barData = {
    labels: chartData.map(item => item.year),
    datasets: [
      {
        label: 'CA',
        data: chartData.map(item => item.ca),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Objectif',
        data: chartData.map(item => item.objectif),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
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
              label += new Intl.NumberFormat('fr-FR', { 
                style: 'currency', 
                currency: 'EUR',
                maximumFractionDigits: 0
              }).format(context.parsed.y);
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
          text: 'Montant (€)'
        },
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('fr-FR', { 
              style: 'currency', 
              currency: 'EUR',
              maximumFractionDigits: 0
            }).format(value);
          }
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

  // Récupérer le nom du commercial
  const commercialName = data[0]?.COM_NOM || `Commercial ${commercialId}`;

  // Calculer les performances annuelles
  const yearlyPerformance = chartData.map(item => {
    const performance = item.objectif > 0 ? (item.ca / item.objectif) * 100 : 0;
    return {
      year: item.year,
      performance: performance.toFixed(2)
    };
  });

  return (
    <div className="chart-container">
      <h3>Performance de {commercialName}</h3>
      <div style={{ height: '400px' }}>
        <Bar data={barData} options={barOptions} />
      </div>
      <div className="performance-summary">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <div 
            style={{ 
              width: '20px', 
              height: '20px', 
              borderRadius: '50%', 
              backgroundColor: performanceColor,
              marginRight: '10px'
            }} 
          />
          <p>
            <strong>Performance globale: {overallPerformance.toFixed(2)}%</strong> 
            ({totalCA.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} / 
            {totalObjectif.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })})
          </p>
        </div>
        <p>Performances annuelles:</p>
        <ul style={{ paddingLeft: '20px' }}>
          {yearlyPerformance.map(item => (
            <li key={item.year}>
              {item.year}: <strong>{item.performance}%</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommercialChart; 
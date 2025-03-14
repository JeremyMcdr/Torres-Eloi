import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CommercialEvolutionChart = ({ data, commercialId }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>Évolution du commercial</h3>
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
        <h3>Évolution du commercial</h3>
        <p>Aucune donnée annuelle disponible pour ce commercial.</p>
      </div>
    );
  }

  // Récupérer le nom du commercial
  const commercialName = data[0]?.COM_NOM || `Commercial ${commercialId}`;

  // Préparer les données pour le graphique
  const lineData = {
    labels: chartData.map(item => item.year),
    datasets: [
      {
        label: 'CA',
        data: chartData.map(item => item.ca),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: false
      },
      {
        label: 'Objectif',
        data: chartData.map(item => item.objectif),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: false
      }
    ]
  };

  // Options du graphique
  const lineOptions = {
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
      <h3>Évolution de {commercialName} au fil du temps</h3>
      <div style={{ height: '400px' }}>
        <Line data={lineData} options={lineOptions} />
      </div>
      <div className="performance-summary">
        <p>Ce graphique montre l'évolution du chiffre d'affaires et des objectifs de {commercialName} au fil des années.</p>
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

export default CommercialEvolutionChart; 
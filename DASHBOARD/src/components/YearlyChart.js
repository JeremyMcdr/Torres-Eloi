import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
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

const YearlyChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>Aucune donnée disponible</div>;
  }

  // Vérifier que les données ont la structure attendue
  const validData = data.filter(item => 
    item && 
    typeof item.COM_ANNEE !== 'undefined' && 
    item.COM_ANNEE !== null
  );

  if (validData.length === 0) {
    return <div>Données invalides ou mal formatées</div>;
  }

  // Trier les données par année
  const sortedData = [...validData].sort((a, b) => a.COM_ANNEE - b.COM_ANNEE);

  const chartData = {
    labels: sortedData.map(item => String(item.COM_ANNEE)),
    datasets: [
      {
        label: 'Chiffre d\'Affaires',
        data: sortedData.map(item => item.TotalCA || 0),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Objectif',
        data: sortedData.map(item => item.TotalObjectif || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chiffre d\'Affaires et Objectifs par Année',
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
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('fr-FR', { 
              style: 'currency', 
              currency: 'EUR',
              maximumFractionDigits: 0
            }).format(value);
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <h2>Évolution par Année</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default YearlyChart; 
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const PerformanceChart = ({ data }) => {
  if (!data) {
    return <div>Aucune donnée disponible</div>;
  }

  // S'assurer que les données ont les bonnes propriétés
  const TotalCA = data.TotalCA || 0;
  const TotalObjectif = data.TotalObjectif || 0;
  
  // Calculer le pourcentage de réalisation
  const achievementPercentage = TotalObjectif > 0 
    ? Math.round((TotalCA / TotalObjectif) * 100) 
    : 0;
  
  const chartData = {
    labels: ['Réalisé', 'Restant'],
    datasets: [
      {
        data: [
          TotalCA,
          TotalObjectif > TotalCA ? TotalObjectif - TotalCA : 0
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
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
        text: `Performance Globale: ${achievementPercentage}%`,
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.raw !== null) {
              label += new Intl.NumberFormat('fr-FR', { 
                style: 'currency', 
                currency: 'EUR',
                maximumFractionDigits: 0
              }).format(context.raw);
            }
            return label;
          }
        }
      }
    },
  };

  return (
    <div className="chart-container">
      <h2>Performance CA vs Objectif</h2>
      <Doughnut data={chartData} options={options} />
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <p>
          <strong>CA Total:</strong> {new Intl.NumberFormat('fr-FR', { 
            style: 'currency', 
            currency: 'EUR',
            maximumFractionDigits: 0
          }).format(TotalCA)}
        </p>
        <p>
          <strong>Objectif Total:</strong> {new Intl.NumberFormat('fr-FR', { 
            style: 'currency', 
            currency: 'EUR',
            maximumFractionDigits: 0
          }).format(TotalObjectif)}
        </p>
      </div>
    </div>
  );
};

export default PerformanceChart; 
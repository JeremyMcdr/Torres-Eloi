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
  Legend,
  Filler
} from 'chart.js';

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TeamTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>Tendance de performance de l'équipe</h3>
        <p>Aucune donnée disponible pour afficher la tendance de l'équipe.</p>
      </div>
    );
  }

  // Trier les données par année
  const sortedData = [...data].sort((a, b) => a.COM_ANNEE - b.COM_ANNEE);

  // Calculer le pourcentage de performance pour chaque année
  const performanceData = sortedData.map(item => {
    const totalCA = item.TotalCA || 0;
    const totalObjectif = item.TotalObjectif || 0;
    const performance = totalObjectif > 0 ? (totalCA / totalObjectif) * 100 : 0;
    return {
      year: item.COM_ANNEE,
      performance,
      totalCA,
      totalObjectif
    };
  });

  // Préparer les données pour le graphique
  const chartData = {
    labels: performanceData.map(item => item.year),
    datasets: [
      {
        label: 'Performance (%)',
        data: performanceData.map(item => item.performance),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
        pointRadius: 5,
        pointHoverRadius: 7
      },
      {
        label: 'Objectif (100%)',
        data: performanceData.map(() => 100),
        borderColor: 'rgba(255, 99, 132, 0.7)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 0
      }
    ]
  };

  // Options du graphique
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const dataIndex = context.dataIndex;
            const datasetIndex = context.datasetIndex;
            
            if (datasetIndex === 0) {
              const item = performanceData[dataIndex];
              return [
                `Performance: ${item.performance.toFixed(2)}%`,
                `CA: ${item.totalCA.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`,
                `Objectif: ${item.totalObjectif.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`
              ];
            } else {
              return `Objectif: 100%`;
            }
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Performance (%)'
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Année'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  // Calculer la performance moyenne sur toutes les années
  const averagePerformance = performanceData.reduce((sum, item) => sum + item.performance, 0) / performanceData.length;

  return (
    <div className="chart-container">
      <h3>Tendance de performance de l'équipe</h3>
      <div style={{ height: '400px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="performance-summary">
        <p>Performance moyenne sur la période: <strong>{averagePerformance.toFixed(2)}%</strong></p>
        <p>Cette tendance montre l'évolution de la performance globale de l'équipe commerciale au fil des années.</p>
        <p>La ligne rouge représente l'objectif de 100% (CA = Objectif).</p>
      </div>
    </div>
  );
};

export default TeamTrendChart; 
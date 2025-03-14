import React from 'react';

const CommercialRanking = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>Classement des commerciaux</h3>
        <p>Aucune donnée disponible pour le classement.</p>
      </div>
    );
  }

  // Fonction pour formater les nombres
  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  // Fonction pour formater les montants en euros
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="chart-container">
      <h3>Classement des commerciaux</h3>
      <div className="ranking-table-container">
        <table className="ranking-table">
          <thead>
            <tr>
              <th>Rang</th>
              <th>Commercial</th>
              <th>CA Total</th>
              <th>Objectif Total</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((commercial, index) => {
              // Déterminer la couleur de l'indicateur de performance
              let performanceColor = '#dc3545'; // Rouge par défaut (< 80%)
              if (commercial.performance >= 100) {
                performanceColor = '#28a745'; // Vert (>= 100%)
              } else if (commercial.performance >= 80) {
                performanceColor = '#ffc107'; // Jaune (>= 80%)
              }
              
              return (
                <tr key={commercial.id}>
                  <td>{index + 1}</td>
                  <td>{commercial.name}</td>
                  <td>{formatCurrency(commercial.totalCA)}</td>
                  <td>{formatCurrency(commercial.totalObjectif)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div 
                        style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          backgroundColor: performanceColor,
                          marginRight: '8px'
                        }} 
                      />
                      {commercial.performance.toFixed(2)}%
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="performance-summary">
        <p>Légende des indicateurs de performance:</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#28a745', marginRight: '8px' }} />
            <span>≥ 100% (Objectif atteint ou dépassé)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffc107', marginRight: '8px' }} />
            <span>≥ 80% (Proche de l'objectif)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#dc3545', marginRight: '8px' }} />
            <span>&lt; 80% (En dessous de l'objectif)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialRanking; 
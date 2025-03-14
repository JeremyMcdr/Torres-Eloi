import React from 'react';

const DataTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>Aucune donnée disponible</div>;
  }

  // Vérifier que les données ont la structure attendue
  const validData = data.filter(item => 
    item && 
    typeof item.ID !== 'undefined' && 
    item.ID !== null
  );

  if (validData.length === 0) {
    return <div>Données invalides ou mal formatées</div>;
  }

  // Formater les nombres avec séparateurs de milliers
  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num || 0);
  };

  return (
    <div className="chart-container">
      <h2>Détail des Données</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Commercial</th>
              <th>Année</th>
              <th>CA</th>
              <th>Objectif</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {validData.map((item) => {
              const ca = item.CA || 0;
              const obj = Math.abs(item.COM_OBJ) || 0;
              const achievementPercentage = obj > 0 
                ? Math.round((ca / obj) * 100) 
                : 0;
              
              // Déterminer la couleur de l'indicateur de performance
              let performanceClass = 'red';
              if (achievementPercentage >= 100) {
                performanceClass = 'green';
              } else if (achievementPercentage >= 80) {
                performanceClass = 'orange';
              }
              
              return (
                <tr key={`${item.ID}-${item.COM_ANNEE}`}>
                  <td>{item.ID}</td>
                  <td>Commercial {item.ID}</td>
                  <td>{item.COM_ANNEE || 'N/A'}</td>
                  <td>{formatNumber(ca)} €</td>
                  <td>{formatNumber(obj)} €</td>
                  <td>
                    <span className={`performance-indicator ${performanceClass}`}></span>
                    <span className="performance-value">{achievementPercentage}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable; 
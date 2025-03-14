import React from 'react';

const StatCard = ({ title, value, unit = '' }) => {
  // Formater les grands nombres avec des séparateurs de milliers
  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <div className="value">
        {formatNumber(value)} {unit}
      </div>
    </div>
  );
};

export default StatCard; 
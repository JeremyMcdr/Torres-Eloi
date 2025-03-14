import React, { useState, useEffect } from 'react';
import './App.css';
import YearlyChart from './components/YearlyChart';
import PerformanceChart from './components/PerformanceChart';
import DataTable from './components/DataTable';
import CommercialChart from './components/CommercialChart';
import CommercialRanking from './components/CommercialRanking';
import TeamTrendChart from './components/TeamTrendChart';
import CommercialEvolutionChart from './components/CommercialEvolutionChart';
import ValidationTimeChart from './components/ValidationTimeChart';
import GlobalValidationTimeChart from './components/GlobalValidationTimeChart';
import { FaFilter, FaChartBar, FaChartPie, FaUsers, FaTable, FaMoneyBill, FaClock } from 'react-icons/fa';

// Fonction pour récupérer toutes les données
const fetchAllData = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/kpi/data');
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    throw error;
  }
};

// Fonction pour récupérer les données par année
const fetchDataByYear = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/kpi/data/by-year');
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des données par année:', error);
    throw error;
  }
};

// Fonction pour récupérer les statistiques
const fetchStats = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/kpi/stats');
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
};

// Composant pour afficher une statistique
const StatCard = ({ title, value, unit = '' }) => {
  // Formater les valeurs selon le type
  let formattedValue = value;
  
  if (unit === '€') {
    formattedValue = new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  } else if (unit === '%') {
    formattedValue = `${new Intl.NumberFormat('fr-FR', { 
      maximumFractionDigits: 2 
    }).format(value)}%`;
  } else {
    formattedValue = new Intl.NumberFormat('fr-FR').format(value);
  }
  
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <div className="stat-value">{formattedValue}</div>
    </div>
  );
};

function App() {
  const [allData, setAllData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [filteredYearlyData, setFilteredYearlyData] = useState([]);
  const [stats, setStats] = useState(null);
  const [filteredStats, setFilteredStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedCommercial, setSelectedCommercial] = useState('all');
  const [filteredData, setFilteredData] = useState([]);
  const [years, setYears] = useState([]);
  const [commercials, setCommercials] = useState([]);
  const [debugInfo, setDebugInfo] = useState(null);
  const [commercialData, setCommercialData] = useState([]);
  const [rankingData, setRankingData] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeKPI, setActiveKPI] = useState('performance'); // 'performance' ou 'validation-time'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setDebugInfo(null);
        
        // Récupérer toutes les données
        console.log("Tentative de récupération des données...");
        const data = await fetchAllData();
        console.log("Données reçues:", data);
        
        // Même si les données sont vides ou invalides, on continue avec un tableau vide
        // pour éviter de bloquer complètement l'application
        const validData = Array.isArray(data) ? data : [];
        
        if (validData.length === 0) {
          setDebugInfo("Aucune donnée valide n'a été reçue de l'API. Vérifiez le format du fichier XLS.");
        } else {
          setDebugInfo(`${validData.length} lignes de données reçues.`);
        }
        
        setAllData(validData);
        
        // Extraire les années uniques pour le filtre
        const uniqueYears = [...new Set(validData.map(item => item.COM_ANNEE).filter(Boolean))].sort();
        setYears(uniqueYears);
        
        // Extraire les commerciaux uniques pour le filtre
        const uniqueCommercials = [...new Set(validData.map(item => item.ID).filter(Boolean))].sort((a, b) => a - b);
        setCommercials(uniqueCommercials);
        
        try {
          // Récupérer les données agrégées par année
          const yearData = await fetchDataByYear();
          if (yearData && Array.isArray(yearData) && yearData.length > 0) {
            setYearlyData(yearData);
            setFilteredYearlyData(yearData);
          } else {
            console.log('Création manuelle des données par année');
            // Créer des données agrégées manuellement si l'API échoue
            const manualYearData = {};
            validData.forEach(item => {
              if (!item.COM_ANNEE) return;
              
              const year = item.COM_ANNEE;
              if (!manualYearData[year]) {
                manualYearData[year] = {
                  COM_ANNEE: year,
                  TotalCA: 0,
                  TotalObjectif: 0
                };
              }
              manualYearData[year].TotalCA += item.CA || 0;
              manualYearData[year].TotalObjectif += item.COM_OBJ || 0;
            });
            
            const yearlyDataArray = Object.values(manualYearData);
            setYearlyData(yearlyDataArray);
            setFilteredYearlyData(yearlyDataArray);
            
            if (yearlyDataArray.length === 0) {
              setDebugInfo((prev) => `${prev} Aucune donnée par année n'a pu être générée.`);
            }
          }
        } catch (yearErr) {
          console.error('Erreur lors de la récupération des données par année:', yearErr);
          // Même logique que ci-dessus
          const manualYearData = {};
          validData.forEach(item => {
            if (!item.COM_ANNEE) return;
            
            const year = item.COM_ANNEE;
            if (!manualYearData[year]) {
              manualYearData[year] = {
                COM_ANNEE: year,
                TotalCA: 0,
                TotalObjectif: 0
              };
            }
            manualYearData[year].TotalCA += item.CA || 0;
            manualYearData[year].TotalObjectif += item.COM_OBJ || 0;
          });
          const yearlyDataArray = Object.values(manualYearData);
          setYearlyData(yearlyDataArray);
          setFilteredYearlyData(yearlyDataArray);
        }
        
        try {
          // Récupérer les statistiques globales
          const statsData = await fetchStats();
          if (statsData && typeof statsData === 'object') {
            setStats(statsData);
            setFilteredStats(statsData);
          } else {
            console.log('Création manuelle des statistiques');
            // Calculer les statistiques manuellement si l'API échoue
            const manualStats = {
              TotalCA: 0,
              TotalObjectif: 0,
              MoyenneCA: 0,
              MaxCA: 0,
              MinCA: Number.MAX_SAFE_INTEGER
            };
            
            validData.forEach(item => {
              const ca = item.CA || 0;
              manualStats.TotalCA += ca;
              manualStats.TotalObjectif += item.COM_OBJ || 0;
              
              if (ca > manualStats.MaxCA) {
                manualStats.MaxCA = ca;
              }
              
              if (ca < manualStats.MinCA && ca > 0) {
                manualStats.MinCA = ca;
              }
            });
            
            manualStats.MoyenneCA = validData.length > 0 ? manualStats.TotalCA / validData.length : 0;
            
            if (manualStats.MinCA === Number.MAX_SAFE_INTEGER) {
              manualStats.MinCA = 0;
            }
            
            setStats(manualStats);
            setFilteredStats(manualStats);
          }
        } catch (statsErr) {
          console.error('Erreur lors de la récupération des statistiques:', statsErr);
          // Même logique que ci-dessus
          const manualStats = {
            TotalCA: 0,
            TotalObjectif: 0,
            MoyenneCA: 0,
            MaxCA: 0,
            MinCA: Number.MAX_SAFE_INTEGER
          };
          
          validData.forEach(item => {
            const ca = item.CA || 0;
            manualStats.TotalCA += ca;
            manualStats.TotalObjectif += item.COM_OBJ || 0;
            
            if (ca > manualStats.MaxCA) {
              manualStats.MaxCA = ca;
            }
            
            if (ca < manualStats.MinCA && ca > 0) {
              manualStats.MinCA = ca;
            }
          });
          
          manualStats.MoyenneCA = validData.length > 0 ? manualStats.TotalCA / validData.length : 0;
          
          if (manualStats.MinCA === Number.MAX_SAFE_INTEGER) {
            manualStats.MinCA = 0;
          }
          
          setStats(manualStats);
          setFilteredStats(manualStats);
        }
        
        // Préparer les données pour le classement des commerciaux
        const commercialPerformance = {};
        
        validData.forEach(item => {
          const commercialId = item.ID;
          if (!commercialId) return;
          
          if (!commercialPerformance[commercialId]) {
            commercialPerformance[commercialId] = {
              id: commercialId,
              totalCA: 0,
              totalObjectif: 0,
              performance: 0
            };
          }
          
          commercialPerformance[commercialId].totalCA += item.CA || 0;
          commercialPerformance[commercialId].totalObjectif += Math.abs(item.COM_OBJ) || 0;
        });
        
        // Calculer la performance et trier
        const rankingArray = Object.values(commercialPerformance).map(item => {
          item.performance = item.totalObjectif > 0 
            ? Math.round((item.totalCA / item.totalObjectif) * 100) 
            : 0;
          return item;
        }).sort((a, b) => b.performance - a.performance);
        
        setRankingData(rankingArray);
        
        setFilteredData(validData);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError(`Erreur lors du chargement des données: ${err.message}`);
        setDebugInfo(`Détails de l'erreur: ${err.stack}`);
        setLoading(false);
        
        // Même en cas d'erreur, on initialise des données vides pour éviter de bloquer l'application
        setAllData([]);
        setYearlyData([]);
        setStats({
          TotalCA: 0,
          TotalObjectif: 0,
          MoyenneCA: 0,
          MaxCA: 0,
          MinCA: 0
        });
        setFilteredData([]);
      }
    };

    fetchData();
  }, []);

  // Filtrer les données en fonction de l'année et du commercial sélectionnés
  useEffect(() => {
    if (!allData || allData.length === 0) return;
    
    // Filtrer les données en fonction de l'année sélectionnée
    let filtered = [...allData];
    
    if (selectedYear !== 'all') {
      filtered = filtered.filter(item => item.COM_ANNEE && item.COM_ANNEE.toString() === selectedYear);
    }
    
    // Filtrer les données en fonction du commercial sélectionné
    if (selectedCommercial !== 'all') {
      filtered = filtered.filter(item => item.ID && item.ID.toString() === selectedCommercial);
    }
    
    setFilteredData(filtered);
    
    // Calculer les statistiques filtrées
    const filteredStatsData = {
      TotalCA: 0,
      TotalObjectif: 0,
      MoyenneCA: 0,
      MaxCA: 0,
      MinCA: Number.MAX_SAFE_INTEGER
    };
    
    filtered.forEach(item => {
      const ca = item.CA || 0;
      filteredStatsData.TotalCA += ca;
      filteredStatsData.TotalObjectif += item.COM_OBJ || 0;
      
      if (ca > filteredStatsData.MaxCA) {
        filteredStatsData.MaxCA = ca;
      }
      
      if (ca < filteredStatsData.MinCA && ca > 0) {
        filteredStatsData.MinCA = ca;
      }
    });
    
    filteredStatsData.MoyenneCA = filtered.length > 0 ? filteredStatsData.TotalCA / filtered.length : 0;
    
    if (filteredStatsData.MinCA === Number.MAX_SAFE_INTEGER) {
      filteredStatsData.MinCA = 0;
    }
    
    setFilteredStats(filteredStatsData);
    
    // Filtrer les données annuelles
    if (selectedYear !== 'all' || selectedCommercial !== 'all') {
      // Si un commercial spécifique est sélectionné, agréger les données par année pour ce commercial
      if (selectedCommercial !== 'all') {
        const commercialYearlyData = {};
        
        // Filtrer d'abord par commercial
        const commercialData = allData.filter(item => item.ID && item.ID.toString() === selectedCommercial);
        
        // Puis agréger par année
        commercialData.forEach(item => {
          if (!item.COM_ANNEE) return;
          
          const year = item.COM_ANNEE;
          if (!commercialYearlyData[year]) {
            commercialYearlyData[year] = {
              COM_ANNEE: year,
              TotalCA: 0,
              TotalObjectif: 0
            };
          }
          commercialYearlyData[year].TotalCA += item.CA || 0;
          commercialYearlyData[year].TotalObjectif += item.COM_OBJ || 0;
        });
        
        const yearlyDataArray = Object.values(commercialYearlyData);
        
        // Si une année spécifique est également sélectionnée, filtrer davantage
        if (selectedYear !== 'all') {
          setFilteredYearlyData(yearlyDataArray.filter(item => item.COM_ANNEE.toString() === selectedYear));
        } else {
          setFilteredYearlyData(yearlyDataArray);
        }
      } else {
        // Si seule l'année est sélectionnée, filtrer les données annuelles par année
        setFilteredYearlyData(yearlyData.filter(item => item.COM_ANNEE.toString() === selectedYear));
      }
    } else {
      // Si aucun filtre n'est appliqué, utiliser toutes les données annuelles
      setFilteredYearlyData(yearlyData);
    }
    
    // Préparer les données pour le classement des commerciaux
    const commercialPerformance = {};
    
    // Utiliser les données filtrées par année
    filtered.forEach(item => {
      if (!item.ID) return;
      
      const id = item.ID;
      if (!commercialPerformance[id]) {
        commercialPerformance[id] = {
          id,
          name: item.COM_NOM || `Commercial ${id}`,
          totalCA: 0,
          totalObjectif: 0
        };
      }
      
      commercialPerformance[id].totalCA += item.CA || 0;
      commercialPerformance[id].totalObjectif += item.COM_OBJ || 0;
    });
    
    // Convertir en tableau et calculer la performance
    const rankingData = Object.values(commercialPerformance)
      .map(commercial => ({
        ...commercial,
        performance: commercial.totalObjectif > 0 
          ? (commercial.totalCA / commercial.totalObjectif) * 100 
          : 0
      }))
      .sort((a, b) => b.performance - a.performance);
    
    setRankingData(rankingData);
    
    // Préparer les données pour le graphique du commercial sélectionné
    if (selectedCommercial !== 'all') {
      const commercialData = filtered.filter(item => item.ID && item.ID.toString() === selectedCommercial);
      setCommercialData(commercialData);
    } else {
      setCommercialData([]);
    }
    
  }, [allData, selectedYear, selectedCommercial, yearlyData]);

  // Gérer le changement d'année dans le filtre
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };
  
  // Gérer le changement de commercial dans le filtre
  const handleCommercialChange = (e) => {
    setSelectedCommercial(e.target.value);
  };

  // Changer d'onglet
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Changer de KPI
  const handleKPIChange = (kpi) => {
    setActiveKPI(kpi);
    // Réinitialiser l'onglet actif lors du changement de KPI
    if (kpi === 'performance') {
      setActiveTab('overview');
    } else if (kpi === 'validation-time') {
      setActiveTab('global-validation');
    }
  };

  if (loading) {
    return <div className="loading">Chargement des données...</div>;
  }

  return (
    <div className="App">
      <div className="dashboard-container">
        <div className="header">
          <h1>Dashboard KPI Commercial</h1>
        </div>

        {error && <div className="error">{error}</div>}
        {debugInfo && <div className="debug-info">{debugInfo}</div>}

        {/* Menu principal des KPIs */}
        <div className="kpi-menu">
          <div 
            className={`kpi-menu-item ${activeKPI === 'performance' ? 'active' : ''}`}
            onClick={() => handleKPIChange('performance')}
          >
            <FaMoneyBill className="kpi-menu-icon" />
            <span>Performance Commerciale</span>
          </div>
          <div 
            className={`kpi-menu-item ${activeKPI === 'validation-time' ? 'active' : ''}`}
            onClick={() => handleKPIChange('validation-time')}
          >
            <FaClock className="kpi-menu-icon" />
            <span>Temps de Validation</span>
          </div>
        </div>

        {/* Filtres */}
        <div className="filter-container">
          <div className="filter-title">
            <FaFilter style={{ marginRight: '8px' }} />
            <span>Filtres</span>
          </div>
          <div className="filter-controls">
            <div>
              <label htmlFor="year-filter">Année:</label>
              <select 
                id="year-filter" 
                value={selectedYear} 
                onChange={handleYearChange}
              >
                <option value="all">Toutes les années</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="commercial-filter">Commercial:</label>
              <select 
                id="commercial-filter" 
                value={selectedCommercial} 
                onChange={handleCommercialChange}
              >
                <option value="all">Tous les commerciaux</option>
                {commercials.map(id => (
                  <option key={id} value={id}>Commercial {id}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sous-menu pour le KPI Performance */}
        {activeKPI === 'performance' && (
          <div className="sub-menu">
            <div 
              className={`sub-menu-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => handleTabChange('overview')}
            >
              <FaChartPie className="sub-menu-icon" />
              <span>Vue d'ensemble</span>
            </div>
            <div 
              className={`sub-menu-item ${activeTab === 'evolution' ? 'active' : ''}`}
              onClick={() => handleTabChange('evolution')}
            >
              <FaChartBar className="sub-menu-icon" />
              <span>Évolution</span>
            </div>
            {selectedCommercial !== 'all' && (
              <div 
                className={`sub-menu-item ${activeTab === 'commercial-evolution' ? 'active' : ''}`}
                onClick={() => handleTabChange('commercial-evolution')}
              >
                <FaChartBar className="sub-menu-icon" />
                <span>Évolution Commercial</span>
              </div>
            )}
            <div 
              className={`sub-menu-item ${activeTab === 'ranking' ? 'active' : ''}`}
              onClick={() => handleTabChange('ranking')}
            >
              <FaUsers className="sub-menu-icon" />
              <span>Classement</span>
            </div>
            <div 
              className={`sub-menu-item ${activeTab === 'data' ? 'active' : ''}`}
              onClick={() => handleTabChange('data')}
            >
              <FaTable className="sub-menu-icon" />
              <span>Données</span>
            </div>
          </div>
        )}

        {/* Sous-menu pour le KPI Temps de Validation */}
        {activeKPI === 'validation-time' && (
          <div className="sub-menu">
            <div 
              className={`sub-menu-item ${activeTab === 'global-validation' ? 'active' : ''}`}
              onClick={() => handleTabChange('global-validation')}
            >
              <FaChartPie className="sub-menu-icon" />
              <span>Vue Globale</span>
            </div>
            {selectedCommercial !== 'all' && (
              <div 
                className={`sub-menu-item ${activeTab === 'commercial-validation' ? 'active' : ''}`}
                onClick={() => handleTabChange('commercial-validation')}
              >
                <FaUsers className="sub-menu-icon" />
                <span>Par Commercial</span>
              </div>
            )}
            <div 
              className={`sub-menu-item ${activeTab === 'validation-data' ? 'active' : ''}`}
              onClick={() => handleTabChange('validation-data')}
            >
              <FaTable className="sub-menu-icon" />
              <span>Données</span>
            </div>
          </div>
        )}

        {/* Contenu des onglets */}
        <div className="tab-content">
          {/* KPI Performance - Vue d'ensemble */}
          {activeKPI === 'performance' && activeTab === 'overview' && (
            <div className="tab-pane">
              {/* Cartes de statistiques */}
              <div className="stats-container">
                <StatCard 
                  title="Chiffre d'Affaires Total" 
                  value={filteredStats?.TotalCA || 0} 
                  unit="€" 
                />
                <StatCard 
                  title="Objectif Total" 
                  value={filteredStats?.TotalObjectif || 0} 
                  unit="€" 
                />
                <StatCard 
                  title="CA Moyen" 
                  value={filteredStats?.MoyenneCA || 0} 
                  unit="€" 
                />
                <StatCard 
                  title="Performance" 
                  value={filteredStats?.TotalObjectif > 0 
                    ? Math.round((filteredStats.TotalCA / filteredStats.TotalObjectif) * 100) 
                    : 0} 
                  unit="%" 
                />
              </div>

              {/* Graphiques principaux */}
              <div className="charts-row">
                <div className="chart-container">
                  <h2>Évolution par Année</h2>
                  <YearlyChart data={filteredYearlyData} />
                </div>
                <div className="chart-container">
                  <h2>Performance CA vs Objectif</h2>
                  <PerformanceChart data={filteredStats} />
                </div>
              </div>
            </div>
          )}

          {/* KPI Performance - Évolution */}
          {activeKPI === 'performance' && activeTab === 'evolution' && (
            <div className="tab-pane">
              {selectedCommercial === 'all' ? (
                <>
                  <div className="chart-container">
                    <h2>Évolution par Année</h2>
                    <YearlyChart data={filteredYearlyData} />
                  </div>
                  <div className="chart-container">
                    <h2>Tendance de Performance de l'Équipe</h2>
                    <TeamTrendChart data={filteredYearlyData} />
                  </div>
                </>
              ) : (
                <>
                  <CommercialChart 
                    data={commercialData} 
                    commercialId={selectedCommercial} 
                  />
                  <CommercialEvolutionChart 
                    data={commercialData} 
                    commercialId={selectedCommercial} 
                  />
                  <div className="chart-container">
                    <h2>Performance du Commercial {selectedCommercial} par rapport aux objectifs</h2>
                    {commercialData.length > 0 ? (
                      <div className="performance-summary">
                        <p>
                          Le commercial {selectedCommercial} a réalisé un chiffre d'affaires total de{' '}
                          <strong>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(commercialData.reduce((sum, item) => sum + (item.CA || 0), 0))}</strong>{' '}
                          pour un objectif de{' '}
                          <strong>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(commercialData.reduce((sum, item) => sum + (item.COM_OBJ || 0), 0))}</strong>.
                        </p>
                      </div>
                    ) : (
                      <div>Aucune donnée disponible pour ce commercial</div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* KPI Performance - Évolution du commercial */}
          {activeKPI === 'performance' && activeTab === 'commercial-evolution' && selectedCommercial !== 'all' && (
            <div className="tab-pane">
              <CommercialEvolutionChart 
                data={commercialData} 
                commercialId={selectedCommercial} 
              />
              <div className="performance-summary">
                <p>
                  <strong>Analyse de l'évolution :</strong> Ce graphique permet de visualiser l'évolution du chiffre d'affaires et des objectifs du commercial {selectedCommercial} au fil des années. 
                  Vous pouvez ainsi identifier les tendances, les périodes de croissance ou de baisse, et comparer directement les performances par rapport aux objectifs fixés.
                </p>
              </div>
            </div>
          )}

          {/* KPI Performance - Classement */}
          {activeKPI === 'performance' && activeTab === 'ranking' && (
            <div className="tab-pane">
              <CommercialRanking data={rankingData} />
            </div>
          )}

          {/* KPI Performance - Données */}
          {activeKPI === 'performance' && activeTab === 'data' && (
            <div className="tab-pane">
              <DataTable data={filteredData} />
            </div>
          )}

          {/* KPI Temps de Validation - Vue Globale */}
          {activeKPI === 'validation-time' && activeTab === 'global-validation' && (
            <div className="tab-pane">
              <div className="stats-container">
                <StatCard 
                  title="Temps Moyen de Validation" 
                  value={5.2} // Valeur simulée
                  unit=" jours" 
                />
                <StatCard 
                  title="Temps Minimum" 
                  value={1.5} // Valeur simulée
                  unit=" jours" 
                />
                <StatCard 
                  title="Temps Maximum" 
                  value={9.8} // Valeur simulée
                  unit=" jours" 
                />
                <StatCard 
                  title="Nombre de Commandes" 
                  value={filteredData.length} 
                  unit="" 
                />
              </div>
              <GlobalValidationTimeChart data={allData} />
            </div>
          )}

          {/* KPI Temps de Validation - Par Commercial */}
          {activeKPI === 'validation-time' && activeTab === 'commercial-validation' && selectedCommercial !== 'all' && (
            <div className="tab-pane">
              <ValidationTimeChart 
                data={commercialData} 
                commercialId={selectedCommercial} 
              />
            </div>
          )}

          {/* KPI Temps de Validation - Données */}
          {activeKPI === 'validation-time' && activeTab === 'validation-data' && (
            <div className="tab-pane">
              <div className="chart-container">
                <h3>Données brutes des temps de validation</h3>
                <p>Note: Ces données sont simulées à des fins de démonstration.</p>
                <table className="validation-time-table">
                  <thead>
                    <tr>
                      <th>Commercial</th>
                      <th>Année</th>
                      <th>Temps Moyen (jours)</th>
                      <th>Nombre de Commandes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commercials.map(id => {
                      // Générer des données simulées pour chaque commercial
                      const commercialName = allData.find(item => item.ID === id)?.COM_NOM || `Commercial ${id}`;
                      return years.map(year => {
                        // Simuler un temps de validation entre 1 et 10 jours
                        const validationTime = (Math.random() * 9 + 1).toFixed(1);
                        // Simuler un nombre de commandes entre 5 et 50
                        const nbCommandes = Math.floor(Math.random() * 45) + 5;
                        return (
                          <tr key={`${id}-${year}`}>
                            <td>{commercialName}</td>
                            <td>{year}</td>
                            <td>{validationTime} jours</td>
                            <td>{nbCommandes}</td>
                          </tr>
                        );
                      });
                    }).flat()}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 
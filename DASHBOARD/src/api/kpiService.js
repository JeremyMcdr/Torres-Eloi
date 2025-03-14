import axios from 'axios';

const API_URL = 'http://localhost:3001/api/kpi';

export const fetchAllData = async () => {
  try {
    const response = await axios.get(`${API_URL}/data`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    throw error;
  }
};

export const fetchDataByYear = async () => {
  try {
    const response = await axios.get(`${API_URL}/data/by-year`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données par année:', error);
    throw error;
  }
};

export const fetchDataForYear = async (year) => {
  try {
    const response = await axios.get(`${API_URL}/data/year/${year}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données pour l'année ${year}:`, error);
    throw error;
  }
};

export const fetchStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
}; 
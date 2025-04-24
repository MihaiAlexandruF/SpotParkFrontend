import api from './api'; 

export const getParkingSpots = async () => {
  const response = await api.get('/parking');
  return response.data;
};

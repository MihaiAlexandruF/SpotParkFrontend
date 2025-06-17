import api from '../services/api';
import { Alert } from 'react-native';

export const fetchUserData = async (setUserData, setLoading, user) => {
  try {
    const response = await api.get("/auth/validate");
    setUserData(response.data);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    setUserData(
      user || {
        name: "Utilizator",
        email: "utilizator@example.com",
        profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
      },
    );
  } finally {
    setLoading(false);
  }
};

export const fetchVehicles = async (setVehicles) => {
  try {
    const res = await api.get("/vehicles");
    setVehicles(res.data);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
  }
};

export const handleAddVehicle = async (newPlate, setVehicles, vehicles, setNewPlate) => {
  if (!newPlate.trim()) return;
  try {
    const res = await api.post("/vehicles", { plateNumber: newPlate.trim().toUpperCase() });
    setVehicles([res.data, ...vehicles]);
    setNewPlate("");
  } catch (error) {
    console.error("Eroare la adăugare număr:", error);
  }
};

export const handleDeleteVehicle = async (id, setVehicles, vehicles) => {
  try {
    await api.delete(`/vehicles/${id}`);
    setVehicles(vehicles.filter((v) => v.id !== id));
  } catch (error) {
    console.error("Eroare la ștergere număr:", error);
  }
}; 
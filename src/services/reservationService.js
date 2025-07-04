import api from "./api";

export const getActiveReservations = async () => {
  const res = await api.get("/reservations/my-reservations/active");
  return res.data;
};

export const getPastReservations = async () => {
  const res = await api.get("/reservations/my-reservations/history");
  return res.data;
};

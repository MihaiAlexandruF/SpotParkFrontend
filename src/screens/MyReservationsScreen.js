import React, { useEffect, useState, useContext } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { AuthContext } from "../auth/AuthContext";
import { getActiveReservations, getPastReservations } from "../services/reservationService";
import ReservationItem from "../components/ReservationItem";

export default function MyReservationsScreen() {
  const { user } = useContext(AuthContext);
  const [active, setActive] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const a = await getActiveReservations();
        const p = await getPastReservations();
        setActive(a);
        setPast(p);
      } catch (e) {
        console.warn("Eroare rezervări:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>⏳ Rezervări Active</Text>
        {active.length === 0 ? (
          <Text style={styles.emptyText}>Nu ai rezervări active.</Text>
        ) : (
          active.map((r) => <ReservationItem key={r.reservationId} data={r} active />)
        )}

        <Text style={styles.sectionTitle}>📅 Rezervări Anterioare</Text>
        {past.length === 0 ? (
          <Text style={styles.emptyText}>Nu ai rezervări anterioare.</Text>
        ) : (
          past.map((r) => <ReservationItem key={r.reservationId} data={r} />)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#121212",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#FFFFFF",
    marginBottom: 12,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
});
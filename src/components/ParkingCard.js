import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ParkingCard({ spot, onClose }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{spot.name}</Text>
      <Text style={styles.address}>{spot.address}</Text>
      <Text style={styles.price}>{spot.price} RON / oră</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>Închide</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  address: {
    fontSize: 14,
    color: "#555",
    marginVertical: 4,
  },
  price: {
    fontSize: 16,
    color: "#00aaff",
    marginBottom: 10,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  closeText: {
    color: "#ff4444",
    fontWeight: "bold",
  },
});

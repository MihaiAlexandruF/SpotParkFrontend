import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ReservationSuccessModal({ visible, onClose, onViewReservations, duration, price }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Ionicons name="checkmark-circle-outline" size={64} color="#4CAF50" />
          <Text style={styles.title}>Rezervare reușită!</Text>
          <Text style={styles.detail}>⏱ Durată: {duration} {duration === 1 ? "oră" : "ore"}</Text>
          <Text style={styles.detail}>💰 Total: {price} RON</Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity onPress={onViewReservations} style={styles.primaryButton}>
              <Text style={styles.primaryText}>Vezi rezervările</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.secondaryButton}>
              <Text style={styles.secondaryText}>Închide</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 12,
  },
  detail: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  buttonGroup: {
    marginTop: 24,
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    paddingVertical: 10,
    alignItems: "center",
  },
  secondaryText: {
    color: "#888",
    fontSize: 14,
  },
});

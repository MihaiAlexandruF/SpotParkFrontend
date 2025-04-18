"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import ScheduleModal from "./ScheduleModal"

const parkingSpots = [
  { id: 1, name: "Spot A1", active: true, earnings: 150, scheduleType: "normal" },
  { id: 2, name: "Spot B2", active: false, earnings: 0, scheduleType: null },
  {
    id: 3,
    name: "Spot C3",
    active: true,
    earnings: 200,
    scheduleType: "daily",
    dailyHours: { start: "09:00", end: "18:00" },
  },
  {
    id: 4,
    name: "Spot D4",
    active: true,
    earnings: 175,
    scheduleType: "weekly",
    weeklySchedule: {
      monday: { active: true, start: "09:00", end: "17:00" },
      tuesday: { active: true, start: "09:00", end: "17:00" },
      wednesday: { active: true, start: "09:00", end: "17:00" },
      thursday: { active: true, start: "09:00", end: "17:00" },
      friday: { active: true, start: "09:00", end: "17:00" },
      saturday: { active: false, start: "", end: "" },
      sunday: { active: false, start: "", end: "" },
    },
  },
]

export default function ParkingSpotList() {
  const [spots, setSpots] = useState(parkingSpots)
  const [selectedSpot, setSelectedSpot] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  const toggleSpot = (id) => {
    const spot = spots.find((s) => s.id === id)

    if (!spot.active) {
      // Dacă activăm parcarea, deschidem modalul de programare
      setSelectedSpot(spot)
      setModalVisible(true)
    } else {
      // Dacă dezactivăm parcarea, doar actualizăm starea
      setSpots(spots.map((spot) => (spot.id === id ? { ...spot, active: false, scheduleType: null } : spot)))
    }
  }

  const handleScheduleSelect = (scheduleData) => {
    if (!selectedSpot) return

    setSpots(
      spots.map((spot) =>
        spot.id === selectedSpot.id
          ? {
              ...spot,
              active: true,
              ...scheduleData,
            }
          : spot,
      ),
    )

    setModalVisible(false)
    setSelectedSpot(null)
  }

  const openScheduleSettings = (spot) => {
    setSelectedSpot(spot)
    setModalVisible(true)
  }

  return (
    <View>
      {spots.map((spot) => (
        <View key={spot.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.spotName}>{spot.name}</Text>
            <Switch value={spot.active} onValueChange={() => toggleSpot(spot.id)} />
          </View>
          <Text style={styles.earnings}>${spot.earnings}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.status}>{spot.active ? "Active" : "Inactive"}</Text>
            {spot.active && spot.scheduleType && (
              <Text style={styles.scheduleType}>
                {spot.scheduleType === "normal" && "Always active"}
                {spot.scheduleType === "daily" && `Daily: ${spot.dailyHours.start} - ${spot.dailyHours.end}`}
                {spot.scheduleType === "weekly" && "Weekly schedule"}
              </Text>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, !spot.active && styles.buttonDisabled]}
              onPress={() => spot.active && openScheduleSettings(spot)}
              disabled={!spot.active}
            >
              <Ionicons name="time-outline" size={20} color={spot.active ? "#007AFF" : "#999"} />
              <Text style={[styles.buttonText, !spot.active && styles.buttonTextDisabled]}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => console.log("Settings")}>
              <Ionicons name="settings-outline" size={20} color="#007AFF" />
              <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <ScheduleModal
        visible={modalVisible}
        spot={selectedSpot}
        onClose={() => {
          setModalVisible(false)
          setSelectedSpot(null)
        }}
        onSave={handleScheduleSelect}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  spotName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  earnings: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statusContainer: {
    marginBottom: 10,
  },
  status: {
    fontSize: 14,
    color: "#666",
  },
  scheduleType: {
    fontSize: 12,
    color: "#007AFF",
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    marginLeft: 5,
    color: "#007AFF",
  },
  buttonTextDisabled: {
    color: "#999",
  },
})


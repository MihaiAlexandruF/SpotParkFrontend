"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import ScheduleModal from "./ScheduleModal"
import { getMyParkingSpots } from "../services/parkingService"

export default function ParkingSpotList() {
  const [spots, setSpots] = useState([])
  const [selectedSpot, setSelectedSpot] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const data = await getMyParkingSpots()

        const spotsMapped = data.map((spot) => ({
          id: spot.parkingLotId,
          name: spot.description || "Parcare fără nume",
          address: spot.address || "",
          active: spot.isActive === undefined ? true : spot.isActive,
          scheduleType:
            spot.availabilitySchedules && spot.availabilitySchedules.length > 0
              ? spot.availabilitySchedules[0].availabilityType
              : "normal",
          earnings: spot.totalEarnings || 0,
          dailyHours:
            spot.availabilitySchedules &&
            spot.availabilitySchedules.length > 0 &&
            spot.availabilitySchedules[0].availabilityType === "daily"
              ? {
                  start: spot.availabilitySchedules[0].dailyOpenTime || "08:00",
                  end: spot.availabilitySchedules[0].dailyCloseTime || "20:00",
                }
              : { start: "08:00", end: "20:00" },
          weeklySchedule:
            spot.availabilitySchedules && spot.availabilitySchedules[0].weeklySchedules
              ? transformWeeklySchedules(spot.availabilitySchedules[0].weeklySchedules)
              : null,
        }))

        setSpots(spotsMapped)
      } catch (error) {
        console.error("❌ Eroare la încărcarea locurilor de parcare:", error)
        setSpots([])
      }
    }

    // Helper function to transform weekly schedules from API format to component format
    const transformWeeklySchedules = (weeklySchedules) => {
      if (!weeklySchedules || !Array.isArray(weeklySchedules)) return null

      const defaultSchedule = {
        monday: { active: false, start: "09:00", end: "17:00" },
        tuesday: { active: false, start: "09:00", end: "17:00" },
        wednesday: { active: false, start: "09:00", end: "17:00" },
        thursday: { active: false, start: "09:00", end: "17:00" },
        friday: { active: false, start: "09:00", end: "17:00" },
        saturday: { active: false, start: "10:00", end: "16:00" },
        sunday: { active: false, start: "10:00", end: "16:00" },
      }

      weeklySchedules.forEach((schedule) => {
        const day = schedule.dayOfWeek.toLowerCase()
        if (defaultSchedule[day]) {
          defaultSchedule[day] = {
            active: true,
            start: schedule.openTime || "09:00",
            end: schedule.closeTime || "17:00",
          }
        }
      })

      return defaultSchedule
    }

    fetchSpots()
  }, [])

  const toggleSpot = (id) => {
    const updatedSpots = spots.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    setSpots(updatedSpots)
  }

  const openScheduleSettings = (spot) => {
    setSelectedSpot(spot)
    setModalVisible(true)
  }

  const handleScheduleSelect = (scheduleData) => {
    if (!selectedSpot) return

    setSpots(
      spots.map((spot) =>
        spot.id === selectedSpot.id
          ? {
              ...spot,
              ...scheduleData,
            }
          : spot,
      ),
    )
    setModalVisible(false)
    setSelectedSpot(null)
  }

  return (
    <View>
      {spots.map((spot) => (
        <View key={spot.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.spotName}>{spot.name}</Text>
            <Switch
              value={spot.active}
              onValueChange={() => toggleSpot(spot.id)}
              trackColor={{ false: "#E0E0E0", true: "#4CAF50" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.earningsContainer}>
            <Text style={styles.earningsLabel}>Venituri</Text>
            <Text style={styles.earnings}>{spot.earnings} RON</Text>
          </View>

          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, spot.active ? styles.statusActive : styles.statusInactive]}>
              <Text style={styles.statusText}>{spot.active ? "Activ" : "Inactiv"}</Text>
            </View>

            {spot.active && spot.scheduleType && (
              <View style={styles.scheduleContainer}>
                <Ionicons name="time-outline" size={16} color="#4CAF50" style={styles.scheduleIcon} />
                <Text style={styles.scheduleType}>
                  {spot.scheduleType === "normal" && "Mereu activ"}
                  {spot.scheduleType === "daily" && `Zilnic: ${spot.dailyHours.start} - ${spot.dailyHours.end}`}
                  {spot.scheduleType === "weekly" && "Program săptămânal"}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, !spot.active && styles.buttonDisabled]}
              onPress={() => spot.active && openScheduleSettings(spot)}
              disabled={!spot.active}
            >
              <Ionicons
                name="calendar-outline"
                size={18}
                color={spot.active ? "#4CAF50" : "#BBBBBB"}
                style={styles.buttonIcon}
              />
              <Text style={[styles.buttonText, !spot.active && styles.buttonTextDisabled]}>Program</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => console.log("Settings pressed")}>
              <Ionicons name="settings-outline" size={18} color="#4CAF50" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Setări</Text>
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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  spotName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#121212",
    fontFamily: "EuclidCircularB-Bold",
    flex: 1,
    paddingRight: 16,
  },
  switchContainer: {
    // Ensure the switch stays within bounds
    alignItems: "flex-end",
    justifyContent: "center",
  },
  earningsContainer: {
    marginBottom: 16,
  },
  earningsLabel: {
    fontSize: 12,
    color: "#757575",
    marginBottom: 4,
    fontFamily: "EuclidCircularB-Regular",
  },
  earnings: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4CAF50",
    fontFamily: "EuclidCircularB-Bold",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  statusActive: {
    backgroundColor: "#E8F5E9",
  },
  statusInactive: {
    backgroundColor: "#F5F5F5",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4CAF50",
    fontFamily: "EuclidCircularB-Bold",
  },
  scheduleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scheduleIcon: {
    marginRight: 4,
  },
  scheduleType: {
    fontSize: 12,
    color: "#4CAF50",
    fontFamily: "EuclidCircularB-Medium",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    marginRight: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    fontSize: 14,
    color: "#4CAF50",
    fontFamily: "EuclidCircularB-Medium",
  },
  buttonTextDisabled: {
    color: "#BBBBBB",
  },
})

"use client"

import { useState, useEffect } from "react"
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Platform, Switch } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { saveAvailability } from "../services/parkingService"

export default function ScheduleModal({ visible, spot, onClose, onSave }) {
  const [scheduleType, setScheduleType] = useState("normal")
  const [dailyHours, setDailyHours] = useState({
    start: "09:00",
    end: "18:00",
  })
  const [weeklySchedule, setWeeklySchedule] = useState({
    monday: { active: true, start: "09:00", end: "17:00" },
    tuesday: { active: true, start: "09:00", end: "17:00" },
    wednesday: { active: true, start: "09:00", end: "17:00" },
    thursday: { active: true, start: "09:00", end: "17:00" },
    friday: { active: true, start: "09:00", end: "17:00" },
    saturday: { active: false, start: "10:00", end: "16:00" },
    sunday: { active: false, start: "10:00", end: "16:00" },
  })

  // State pentru TimePicker
  const [showPicker, setShowPicker] = useState(false)
  const [currentField, setCurrentField] = useState(null)
  const [currentDay, setCurrentDay] = useState(null)
  const [tempTime, setTempTime] = useState(new Date())

  useEffect(() => {
    if (spot) {
      setScheduleType(spot.scheduleType || "normal")
      if (spot.dailyHours) {
        setDailyHours(spot.dailyHours)
      }
      if (spot.weeklySchedule) {
        setWeeklySchedule(spot.weeklySchedule)
      }
    }
  }, [spot])

  const handleSave = async () => {
    if (!spot) return

    const scheduleData = {
      availabilityType: scheduleType,
      dailyOpenTime: null,
      dailyCloseTime: null,
      weeklySchedules: null,
    }

    if (scheduleType === "daily") {
      scheduleData.dailyOpenTime = dailyHours.start
      scheduleData.dailyCloseTime = dailyHours.end
    } else if (scheduleType === "weekly") {
      scheduleData.weeklySchedules = Object.entries(weeklySchedule)
        .filter(([day, daySchedule]) => daySchedule.active)
        .map(([day, daySchedule]) => ({
          dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
          openTime: daySchedule.start,
          closeTime: daySchedule.end,
        }))
    }

    try {
      await saveAvailability(spot.id, scheduleData)

      // Update the local state to reflect the changes
      const updatedSpot = {
        ...spot,
        scheduleType: scheduleType,
        dailyHours: scheduleType === "daily" ? dailyHours : spot.dailyHours,
        weeklySchedule: scheduleType === "weekly" ? weeklySchedule : spot.weeklySchedule,
      }

      onSave(updatedSpot)
    } catch (error) {
      console.error("❌ Eroare la salvarea programului:", error)
    }
  }

  const updateWeeklyDay = (day, field, value) => {
    setWeeklySchedule({
      ...weeklySchedule,
      [day]: {
        ...weeklySchedule[day],
        [field]: value,
      },
    })
  }

  // Funcție pentru a deschide TimePicker
  const openTimePicker = (field, day = null, timeString) => {
    // Convertim string-ul de timp în Date
    const [hours, minutes] = timeString.split(":").map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0, 0)

    setTempTime(date)
    setCurrentField(field)
    setCurrentDay(day)
    setShowPicker(true)
  }

  // Funcție pentru a gestiona schimbarea orei în TimePicker
  const handleTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || tempTime

    // Pe iOS, picker-ul rămâne deschis până când utilizatorul apasă "Done"
    // Pe Android, picker-ul se închide automat după selecție
    if (Platform.OS === "android") {
      setShowPicker(false)
    }

    if (selectedDate) {
      setTempTime(currentDate)

      const hours = currentDate.getHours().toString().padStart(2, "0")
      const minutes = currentDate.getMinutes().toString().padStart(2, "0")
      const timeString = `${hours}:${minutes}`

      if (currentDay) {
        // Pentru programul săptămânal
        updateWeeklyDay(currentDay, currentField, timeString)
      } else {
        // Pentru programul zilnic
        setDailyHours({
          ...dailyHours,
          [currentField]: timeString,
        })
      }
    }
  }

  // Funcție pentru a închide picker-ul pe iOS
  const handleIosDone = () => {
    setShowPicker(false)

    const hours = tempTime.getHours().toString().padStart(2, "0")
    const minutes = tempTime.getMinutes().toString().padStart(2, "0")
    const timeString = `${hours}:${minutes}`

    if (currentDay) {
      // Pentru programul săptămânal
      updateWeeklyDay(currentDay, currentField, timeString)
    } else {
      // Pentru programul zilnic
      setDailyHours({
        ...dailyHours,
        [currentField]: timeString,
      })
    }
  }

  const renderDailySchedule = () => (
    <View style={styles.scheduleContainer}>
      <Text style={styles.scheduleLabel}>Set daily hours:</Text>
      <View style={styles.timeInputContainer}>
        <View style={styles.timeInput}>
          <Text style={styles.timeLabel}>Start:</Text>
          <TouchableOpacity style={styles.timeButton} onPress={() => openTimePicker("start", null, dailyHours.start)}>
            <Text style={styles.timeButtonText}>{dailyHours.start}</Text>
            <Ionicons name="time-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.timeInput}>
          <Text style={styles.timeLabel}>End:</Text>
          <TouchableOpacity style={styles.timeButton} onPress={() => openTimePicker("end", null, dailyHours.end)}>
            <Text style={styles.timeButtonText}>{dailyHours.end}</Text>
            <Ionicons name="time-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  const renderWeeklySchedule = () => (
    <View style={styles.scheduleContainer}>
      <Text style={styles.scheduleLabel}>Set weekly schedule:</Text>
      {Object.entries(weeklySchedule).map(([day, schedule]) => (
        <View key={day} style={styles.weekDay}>
          <View style={styles.weekDayHeader}>
            <Text style={styles.weekDayName}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
            <Switch value={schedule.active} onValueChange={(value) => updateWeeklyDay(day, "active", value)} />
          </View>
          {schedule.active && (
            <View style={styles.timeInputContainer}>
              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>Start:</Text>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => openTimePicker("start", day, schedule.start)}
                >
                  <Text style={styles.timeButtonText}>{schedule.start}</Text>
                  <Ionicons name="time-outline" size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>End:</Text>
                <TouchableOpacity style={styles.timeButton} onPress={() => openTimePicker("end", day, schedule.end)}>
                  <Text style={styles.timeButtonText}>{schedule.end}</Text>
                  <Ionicons name="time-outline" size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ))}
    </View>
  )

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Parking Schedule</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Schedule Type</Text>
            <View style={styles.scheduleTypeContainer}>
              <TouchableOpacity
                style={[styles.scheduleTypeButton, scheduleType === "normal" && styles.scheduleTypeButtonActive]}
                onPress={() => setScheduleType("normal")}
              >
                <Text style={[styles.scheduleTypeText, scheduleType === "normal" && styles.scheduleTypeTextActive]}>
                  Normal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.scheduleTypeButton, scheduleType === "daily" && styles.scheduleTypeButtonActive]}
                onPress={() => setScheduleType("daily")}
              >
                <Text style={[styles.scheduleTypeText, scheduleType === "daily" && styles.scheduleTypeTextActive]}>
                  Daily
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.scheduleTypeButton, scheduleType === "weekly" && styles.scheduleTypeButtonActive]}
                onPress={() => setScheduleType("weekly")}
              >
                <Text style={[styles.scheduleTypeText, scheduleType === "weekly" && styles.scheduleTypeTextActive]}>
                  Weekly
                </Text>
              </TouchableOpacity>
            </View>

            {scheduleType === "normal" && (
              <View style={styles.scheduleContainer}>
                <Text style={styles.normalScheduleText}>Parking spot will be always active</Text>
              </View>
            )}

            {scheduleType === "daily" && renderDailySchedule()}
            {scheduleType === "weekly" && renderWeeklySchedule()}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={onClose}>
              <Text style={styles.buttonCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonSave]} onPress={handleSave}>
              <Text style={styles.buttonSaveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showPicker && (
        <View style={styles.pickerOverlay}>
          <TouchableOpacity style={styles.pickerBackdrop} onPress={() => setShowPicker(false)} />
          <View style={styles.pickerContainer}>
            {Platform.OS === "ios" && (
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.pickerCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleIosDone}>
                  <Text style={styles.pickerDone}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.pickerWrapper}>
              <DateTimePicker
                value={tempTime}
                mode="time"
                is24Hour={true}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleTimeChange}
                style={styles.picker}
                textColor="#000000"
              />
            </View>
          </View>
        </View>
      )}
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContent: {
    padding: 15,
    maxHeight: "70%",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scheduleTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  scheduleTypeButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  scheduleTypeButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  scheduleTypeText: {
    color: "#333",
  },
  scheduleTypeTextActive: {
    color: "white",
  },
  scheduleContainer: {
    marginTop: 10,
  },
  normalScheduleText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  scheduleLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  timeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  timeInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  timeLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  timeButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
  },
  timeButtonText: {
    fontSize: 14,
  },
  weekDay: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 5,
    padding: 10,
  },
  weekDayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  weekDayName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  buttonSave: {
    backgroundColor: "#007AFF",
  },
  buttonCancel: {
    backgroundColor: "#f0f0f0",
  },
  buttonSaveText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonCancelText: {
    color: "#333",
  },
  pickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
  pickerBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f0f0f0",
  },
  pickerCancel: {
    color: "#999",
    fontSize: 16,
  },
  pickerDone: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  pickerWrapper: {
    alignItems: "center", // Centrează picker-ul orizontal
    justifyContent: "center",
    paddingHorizontal: 20, // Adaugă padding orizontal
    backgroundColor: "#f0f0f0",
  },
  picker: {
    width: Platform.OS === "ios" ? 300 : "100%", // Lățime fixă pe iOS pentru centrare
    height: 200,
    alignSelf: "center", // Centrează picker-ul
    backgroundColor: "#f0f0f0",
  },
})

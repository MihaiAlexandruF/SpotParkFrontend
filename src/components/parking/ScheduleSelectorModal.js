"use client"

import { useState, useEffect } from "react"
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Platform, Switch } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"

export default function ScheduleSelectorModal({ visible, initialSchedule, onClose, onSave }) {
  const [availabilityType, setAvailabilityType] = useState("always")
  const [dailyOpenTime, setDailyOpenTime] = useState("08:00")
  const [dailyCloseTime, setDailyCloseTime] = useState("18:00")
  const [weeklySchedules, setWeeklySchedules] = useState([
    { dayOfWeek: "Monday", openTime: "09:00", closeTime: "17:00", active: true },
    { dayOfWeek: "Tuesday", openTime: "09:00", closeTime: "17:00", active: true },
    { dayOfWeek: "Wednesday", openTime: "09:00", closeTime: "17:00", active: true },
    { dayOfWeek: "Thursday", openTime: "09:00", closeTime: "17:00", active: true },
    { dayOfWeek: "Friday", openTime: "09:00", closeTime: "17:00", active: true },
    { dayOfWeek: "Saturday", openTime: "10:00", closeTime: "16:00", active: false },
    { dayOfWeek: "Sunday", openTime: "10:00", closeTime: "16:00", active: false }
  ])

  // State pentru TimePicker
  const [showPicker, setShowPicker] = useState(false)
  const [currentField, setCurrentField] = useState(null)
  const [currentDay, setCurrentDay] = useState(null)
  const [tempTime, setTempTime] = useState(new Date())

  useEffect(() => {
    if (initialSchedule) {
      setAvailabilityType(initialSchedule.availabilityType || "always")
      if (initialSchedule.dailyOpenTime) {
        setDailyOpenTime(initialSchedule.dailyOpenTime)
      }
      if (initialSchedule.dailyCloseTime) {
        setDailyCloseTime(initialSchedule.dailyCloseTime)
      }
      if (initialSchedule.weeklySchedules) {
        setWeeklySchedules(initialSchedule.weeklySchedules)
      }
    }
  }, [initialSchedule])

  const handleSave = () => {
    let scheduleData = { availabilityType }

    if (availabilityType === "daily") {
      scheduleData = {
        ...scheduleData,
        dailyOpenTime,
        dailyCloseTime
      }
    } else if (availabilityType === "weekly") {
      scheduleData = {
        ...scheduleData,
        weeklySchedules: weeklySchedules.filter(schedule => schedule.active)
      }
    }

    onSave(scheduleData)
  }

  const updateWeeklySchedule = (dayOfWeek, field, value) => {
    setWeeklySchedules(schedules => 
      schedules.map(schedule => 
        schedule.dayOfWeek === dayOfWeek 
          ? { ...schedule, [field]: value }
          : schedule
      )
    )
  }

  const openTimePicker = (field, dayOfWeek = null, timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0, 0)

    setTempTime(date)
    setCurrentField(field)
    setCurrentDay(dayOfWeek)
    setShowPicker(true)
  }

  const handleTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || tempTime

    if (Platform.OS === "android") {
      setShowPicker(false)
    }

    if (selectedDate) {
      setTempTime(currentDate)

      const hours = currentDate.getHours().toString().padStart(2, "0")
      const minutes = currentDate.getMinutes().toString().padStart(2, "0")
      const timeString = `${hours}:${minutes}`

      if (currentDay) {
        updateWeeklySchedule(currentDay, currentField, timeString)
      } else {
        if (currentField === "openTime") {
          setDailyOpenTime(timeString)
        } else {
          setDailyCloseTime(timeString)
        }
      }
    }
  }

  const handleIosDone = () => {
    setShowPicker(false)

    const hours = tempTime.getHours().toString().padStart(2, "0")
    const minutes = tempTime.getMinutes().toString().padStart(2, "0")
    const timeString = `${hours}:${minutes}`

    if (currentDay) {
      updateWeeklySchedule(currentDay, currentField, timeString)
    } else {
      if (currentField === "openTime") {
        setDailyOpenTime(timeString)
      } else {
        setDailyCloseTime(timeString)
      }
    }
  }

  const renderDailySchedule = () => (
    <View style={styles.scheduleContainer}>
      <Text style={styles.scheduleLabel}>Setare program zilnic:</Text>
      <View style={styles.timeInputContainer}>
        <View style={styles.timeInput}>
          <Text style={styles.timeLabel}>Început:</Text>
          <TouchableOpacity style={styles.timeButton} onPress={() => openTimePicker("openTime", null, dailyOpenTime)}>
            <Text style={styles.timeButtonText}>{dailyOpenTime}</Text>
            <Ionicons name="time-outline" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
        <View style={styles.timeInput}>
          <Text style={styles.timeLabel}>Sfârșit:</Text>
          <TouchableOpacity style={styles.timeButton} onPress={() => openTimePicker("closeTime", null, dailyCloseTime)}>
            <Text style={styles.timeButtonText}>{dailyCloseTime}</Text>
            <Ionicons name="time-outline" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  const renderWeeklySchedule = () => (
    <View style={styles.scheduleContainer}>
      <Text style={styles.scheduleLabel}>Setare program săptămânal:</Text>
      {weeklySchedules.map((schedule) => (
        <View key={schedule.dayOfWeek} style={styles.weekDay}>
          <View style={styles.weekDayHeader}>
            <Text style={styles.weekDayName}>
              {schedule.dayOfWeek === "Monday" ? "Luni" :
               schedule.dayOfWeek === "Tuesday" ? "Marți" :
               schedule.dayOfWeek === "Wednesday" ? "Miercuri" :
               schedule.dayOfWeek === "Thursday" ? "Joi" :
               schedule.dayOfWeek === "Friday" ? "Vineri" :
               schedule.dayOfWeek === "Saturday" ? "Sâmbătă" : "Duminică"}
            </Text>
            <Switch 
              value={schedule.active} 
              onValueChange={(value) => updateWeeklySchedule(schedule.dayOfWeek, "active", value)}
              trackColor={{ false: "#E0E0E0", true: "#4CAF50" }}
              thumbColor="#FFFFFF"
            />
          </View>
          {schedule.active && (
            <View style={styles.timeInputContainer}>
              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>Început:</Text>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => openTimePicker("openTime", schedule.dayOfWeek, schedule.openTime)}
                >
                  <Text style={styles.timeButtonText}>{schedule.openTime}</Text>
                  <Ionicons name="time-outline" size={20} color="#4CAF50" />
                </TouchableOpacity>
              </View>
              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>Sfârșit:</Text>
                <TouchableOpacity 
                  style={styles.timeButton} 
                  onPress={() => openTimePicker("closeTime", schedule.dayOfWeek, schedule.closeTime)}
                >
                  <Text style={styles.timeButtonText}>{schedule.closeTime}</Text>
                  <Ionicons name="time-outline" size={20} color="#4CAF50" />
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
            <Text style={styles.modalTitle}>Program de funcționare</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Tip program</Text>
            <View style={styles.scheduleTypeContainer}>
              <TouchableOpacity
                style={[styles.scheduleTypeButton, availabilityType === "always" && styles.scheduleTypeButtonActive]}
                onPress={() => setAvailabilityType("always")}
              >
                <Text style={[styles.scheduleTypeText, availabilityType === "always" && styles.scheduleTypeTextActive]}>
                  Mereu activ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.scheduleTypeButton, availabilityType === "daily" && styles.scheduleTypeButtonActive]}
                onPress={() => setAvailabilityType("daily")}
              >
                <Text style={[styles.scheduleTypeText, availabilityType === "daily" && styles.scheduleTypeTextActive]}>
                  Zilnic
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.scheduleTypeButton, availabilityType === "weekly" && styles.scheduleTypeButtonActive]}
                onPress={() => setAvailabilityType("weekly")}
              >
                <Text style={[styles.scheduleTypeText, availabilityType === "weekly" && styles.scheduleTypeTextActive]}>
                  Săptămânal
                </Text>
              </TouchableOpacity>
            </View>

            {availabilityType === "always" && (
              <View style={styles.scheduleContainer}>
                <Text style={styles.normalScheduleText}>Locul de parcare va fi mereu activ</Text>
              </View>
            )}

            {availabilityType === "daily" && renderDailySchedule()}
            {availabilityType === "weekly" && renderWeeklySchedule()}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={onClose}>
              <Text style={styles.buttonCancelText}>Anulează</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonSave]} onPress={handleSave}>
              <Text style={styles.buttonSaveText}>Salvează</Text>
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
                  <Text style={styles.pickerCancel}>Anulează</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleIosDone}>
                  <Text style={styles.pickerDone}>Gata</Text>
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
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#121212",
    fontFamily: "EuclidCircularB-Bold",
  },
  modalContent: {
    maxHeight: "80%",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#121212",
    marginBottom: 12,
    fontFamily: "EuclidCircularB-Medium",
  },
  scheduleTypeContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 4,
  },
  scheduleTypeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  scheduleTypeButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleTypeText: {
    fontSize: 14,
    color: "#757575",
    fontFamily: "EuclidCircularB-Medium",
  },
  scheduleTypeTextActive: {
    color: "#4CAF50",
  },
  scheduleContainer: {
    marginBottom: 20,
  },
  scheduleLabel: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 12,
    fontFamily: "EuclidCircularB-Medium",
  },
  timeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    color: "#757575",
    marginBottom: 4,
    fontFamily: "EuclidCircularB-Regular",
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
  },
  timeButtonText: {
    fontSize: 16,
    color: "#121212",
    fontFamily: "EuclidCircularB-Medium",
  },
  weekDay: {
    marginBottom: 16,
  },
  weekDayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  weekDayName: {
    fontSize: 14,
    color: "#121212",
    fontFamily: "EuclidCircularB-Medium",
  },
  normalScheduleText: {
    fontSize: 14,
    color: "#757575",
    fontFamily: "EuclidCircularB-Regular",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonCancel: {
    backgroundColor: "#F5F5F5",
  },
  buttonSave: {
    backgroundColor: "#4CAF50",
  },
  buttonCancelText: {
    fontSize: 16,
    color: "#757575",
    fontFamily: "EuclidCircularB-Medium",
  },
  buttonSaveText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "EuclidCircularB-Medium",
  },
  pickerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  pickerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  pickerCancel: {
    fontSize: 16,
    color: "#757575",
    fontFamily: "EuclidCircularB-Medium",
  },
  pickerDone: {
    fontSize: 16,
    color: "#4CAF50",
    fontFamily: "EuclidCircularB-Medium",
  },
  pickerWrapper: {
    padding: 16,
  },
  picker: {
    height: 200,
  },
}) 
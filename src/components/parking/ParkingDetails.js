import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ParkingDetails({
  name,
  setName,
  address,
  setAddress,
  price,
  setPrice,
  onSchedulePress,
  scheduleType,
  scheduleData
}) {
  const getScheduleText = () => {
    if (!scheduleData) return "Setare program"
    
    switch (scheduleData.scheduleType) {
      case "always":
        return "Program: Non-stop"
      case "normal":
        return `Program: ${scheduleData.dailyHours?.start || "09:00"} - ${scheduleData.dailyHours?.end || "18:00"}`
      case "weekly":
        const activeDays = Object.entries(scheduleData.weeklySchedule)
          .filter(([_, schedule]) => schedule.active)
          .map(([day, schedule]) => {
            const dayNames = {
              monday: "Luni",
              tuesday: "Marți",
              wednesday: "Miercuri",
              thursday: "Joi",
              friday: "Vineri",
              saturday: "Sâmbătă",
              sunday: "Duminică"
            }
            return `${dayNames[day]} ${schedule.start}-${schedule.end}`
          })
        return activeDays.length > 0 
          ? `Program: ${activeDays.join(", ")}`
          : "Setare program"
      default:
        return "Setare program"
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalii parcăre</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nume</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Introduceți numele parcării"
          placeholderTextColor="#9E9E9E"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Adresă</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Introduceți adresa parcării"
          placeholderTextColor="#9E9E9E"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Preț per oră (RON)</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Introduceți prețul per oră"
          placeholderTextColor="#9E9E9E"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.scheduleButton} onPress={onSchedulePress}>
        <Text style={styles.scheduleButtonText}>{getScheduleText()}</Text>
        <Ionicons name="time-outline" size={20} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 16,
    fontFamily: 'EuclidCircularB-Bold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
    fontFamily: 'EuclidCircularB-Medium',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#121212',
    fontFamily: 'EuclidCircularB-Regular',
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
  },
  scheduleButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#4CAF50',
    fontFamily: 'EuclidCircularB-Medium',
  },
}); 
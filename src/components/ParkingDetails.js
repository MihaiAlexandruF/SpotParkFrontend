import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function ParkingDetails({ name, setName, address, setAddress, price, setPrice, onSchedulePress, scheduleType }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parking Details</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter parking name"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter parking address"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Price per hour (RON)</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.scheduleButton} onPress={onSchedulePress}>
        <Ionicons name="time-outline" size={20} color="#4CAF50" style={styles.scheduleIcon} />
        <Text style={styles.scheduleButtonText}>
          {scheduleType === "normal" ? "Set Schedule" : 
           scheduleType === "daily" ? "Daily Schedule" : 
           "Weekly Schedule"}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#121212",
    marginBottom: 16,
    fontFamily: "EuclidCircularB-Bold",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 8,
    fontFamily: "EuclidCircularB-Medium",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#121212",
    fontFamily: "EuclidCircularB-Regular",
  },
  scheduleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  scheduleIcon: {
    marginRight: 8,
  },
  scheduleButtonText: {
    fontSize: 16,
    color: "#4CAF50",
    fontFamily: "EuclidCircularB-Medium",
  },
}) 
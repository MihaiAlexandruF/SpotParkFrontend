import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function VehicleSelector({ vehicles, selectedVehicle, onSelectVehicle }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newRegistration, setNewRegistration] = useState("");

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (isAddingNew) {
      setIsAddingNew(false);
      setNewRegistration("");
    }
  };

  const selectVehicle = (vehicle) => {
    onSelectVehicle(vehicle);
    setIsExpanded(false);
  };

  const startAddingNew = () => setIsAddingNew(true);

  const addNewVehicle = () => {
    if (newRegistration.trim().length >= 4) {
      const newVehicle = {
        id: `vehicle-${Date.now()}`,
        plateNumber: newRegistration.trim().toUpperCase(),
      };
      onSelectVehicle(newVehicle);
      setIsAddingNew(false);
      setNewRegistration("");
      setIsExpanded(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Număr de înmatriculare</Text>

      <TouchableOpacity style={styles.selector} onPress={toggleExpand} activeOpacity={0.7}>
        <View style={styles.selectedVehicle}>
          <View style={styles.vehicleIcon}>
            <Ionicons name="car-outline" size={20} color="#000" />
          </View>
          <Text style={styles.vehicleName}>
            {selectedVehicle ? selectedVehicle.plateNumber : "Selectează vehiculul"}
          </Text>
        </View>
        <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#777" />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.expandedOptions}>
          {vehicles.map((vehicle) => (
            <TouchableOpacity
              key={vehicle.id}
              style={[styles.option, selectedVehicle?.id === vehicle.id && styles.selectedOption]}
              onPress={() => selectVehicle(vehicle)}
            >
              <Ionicons name="car-outline" size={20} color="#000" />
              <Text style={styles.optionName}>{vehicle.plateNumber}</Text>
              {vehicle.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Implicit</Text>
                </View>
              )}
              {selectedVehicle?.id === vehicle.id && <Ionicons name="checkmark" size={20} color="#4CAF50" />}
            </TouchableOpacity>
          ))}

          {isAddingNew ? (
            <View style={styles.addNewContainer}>
              <TextInput
                style={styles.input}
                placeholder="Introdu numărul de înmatriculare"
                value={newRegistration}
                onChangeText={setNewRegistration}
                autoCapitalize="characters"
                autoFocus
              />
              <TouchableOpacity
                style={[styles.addButton, newRegistration.trim().length < 4 && styles.addButtonDisabled]}
                onPress={addNewVehicle}
                disabled={newRegistration.trim().length < 4}
              >
                <Text style={styles.addButtonText}>Adaugă</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addNewOption} onPress={startAddingNew}>
              <Ionicons name="add-circle-outline" size={20} color="#4CAF50" />
              <Text style={styles.addNewText}>Adaugă vehicul nou</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    fontFamily: "EuclidCircularB-Medium",
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  selectedVehicle: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEEEEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  vehicleName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    fontFamily: "EuclidCircularB-Medium",
  },
  expandedOptions: {
    marginTop: 8,
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  selectedOption: {
    backgroundColor: "#F0F0F0",
  },
  optionName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
    marginLeft: 12,
    flex: 1,
    fontFamily: "EuclidCircularB-Medium",
  },
  defaultBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  defaultText: {
    fontSize: 12,
    color: "#4CAF50",
    fontFamily: "EuclidCircularB-Medium",
  },
  addNewOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  addNewText: {
    fontSize: 15,
    color: "#4CAF50",
    marginLeft: 12,
    fontFamily: "EuclidCircularB-Medium",
  },
  addNewContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  input: {
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 15,
    fontFamily: "EuclidCircularB-Regular",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "EuclidCircularB-Medium",
  },
});
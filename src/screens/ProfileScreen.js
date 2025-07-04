"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import BottomToolbar from "../components/BottomToolbar"
import { useAuth } from "../auth/AuthContext"
import api from "../services/api"
import { fetchUserData, fetchVehicles, handleAddVehicle, handleDeleteVehicle } from '../utils/profileUtils';

export default function ProfileScreen({ navigation }) {
  const { user, handleLogout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)
  const [vehicles, setVehicles] = useState([])
  const [newPlate, setNewPlate] = useState("")

  useEffect(() => {
    fetchUserData(setUserData, setLoading, user)
    fetchVehicles(setVehicles)
  }, [user])

  const toggleNotifications = () => setNotificationsEnabled((prev) => !prev)
  const toggleDarkMode = () => setDarkModeEnabled((prev) => !prev)

  const confirmLogout = () => {
    Alert.alert("Deconectare", "Sigur doriți să vă deconectați?", [
      { text: "Anulează", style: "cancel" },
      { text: "Deconectare", style: "destructive", onPress: handleLogout },
    ])
  }

  const onAddVehicle = () => {
     console.log("🟡 S-a apăsat Adaugă:", newPlate);
    handleAddVehicle(newPlate, setVehicles, vehicles, setNewPlate)
  }

  const onDeleteVehicle = (id) => {
    handleDeleteVehicle(id, setVehicles, vehicles)
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>        
        <ActivityIndicator size="large" color="#FFFC00" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#121212", "#1A1A1A"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Profil</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
  style={{
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 24,
    marginTop: 24,
  }}
  onPress={() => navigation.navigate("MyReservations")}
>
  <Text style={{ color: "white", fontWeight: "bold", fontSize: 16, textAlign: "center" }}>
    Rezervările mele
  </Text>
</TouchableOpacity>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Numere de înmatriculare</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <TextInput
              placeholder="Adaugă un număr nou"
              value={newPlate}
              onChangeText={setNewPlate}
              style={{ flex: 1, borderBottomWidth: 1, borderColor: "#ccc", paddingVertical: 6 }}
            />
            <TouchableOpacity onPress={onAddVehicle} style={{ marginLeft: 12 }}>
              <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          {vehicles.map((vehicle) => (
            <View key={vehicle.id} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 }}>
              <Text style={{ fontSize: 14, color: "#333", fontFamily: "EuclidCircularB-Medium" }}>{vehicle.plateNumber}</Text>
              <TouchableOpacity onPress={() => onDeleteVehicle(vehicle.id)}>
                <Ionicons name="trash-outline" size={18} color="#FF5252" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF5252" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Deconectare</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Versiune 1.0.0</Text>
      </ScrollView>

      <BottomToolbar navigation={navigation} activeScreen="Profile" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    fontFamily: "EuclidCircularB-Bold",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileCard: {
    marginTop: -20,
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  editAvatarBlur: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#121212",
    marginBottom: 4,
    fontFamily: "EuclidCircularB-Bold",
  },
  profileEmail: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 12,
    fontFamily: "EuclidCircularB-Regular",
  },
  editProfileButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  editProfileText: {
    fontSize: 12,
    color: "#121212",
    fontFamily: "EuclidCircularB-Medium",
  },
  section: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#121212",
    marginBottom: 16,
    fontFamily: "EuclidCircularB-Bold",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: "#121212",
    marginBottom: 2,
    fontFamily: "EuclidCircularB-Medium",
  },
  settingDescription: {
    fontSize: 12,
    color: "#757575",
    fontFamily: "EuclidCircularB-Regular",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginHorizontal: 20,
    backgroundColor: "#FFF0F0",
    paddingVertical: 16,
    borderRadius: 16,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    color: "#FF5252",
    fontWeight: "bold",
    fontFamily: "EuclidCircularB-Bold",
  },
  versionText: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    fontSize: 12,
    color: "#999",
    fontFamily: "EuclidCircularB-Regular",
  },
})

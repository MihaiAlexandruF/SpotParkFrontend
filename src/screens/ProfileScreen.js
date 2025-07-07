import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import BottomToolbar from "../components/BottomToolbar"
import { useAuth } from "../auth/AuthContext"
import api from "../services/api"
import * as WebBrowser from "expo-web-browser"
import * as Linking from "expo-linking"
import { fetchUserData, fetchVehicles, handleAddVehicle, handleDeleteVehicle } from "../utils/profileUtils"

export default function ProfileScreen({ navigation }) {
  const { user, handleLogout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [newPlate, setNewPlate] = useState("")
  const [balance, setBalance] = useState(null)
  const [showAddFundsModal, setShowAddFundsModal] = useState(false)
  const [fundAmount, setFundAmount] = useState("")
  const [addingFunds, setAddingFunds] = useState(false)

  useEffect(() => {
    fetchUserData(setUserData, setLoading, user)
    fetchVehicles(setVehicles)
    fetchBalance()
  }, [user])

  const fetchBalance = async () => {
    try {
      const response = await api.get("/wallet")
      setBalance(response.data.balance)
    } catch (error) {
      console.error("Eroare la obținerea balanței:", error)
    }
  }

  const handleAddFunds = async () => {
    if (!fundAmount || isNaN(fundAmount) || Number.parseFloat(fundAmount) <= 0) {
      Alert.alert("Eroare", "Introduceți o sumă validă")
      return
    }

    setAddingFunds(true)
    try {
      const response = await api.post("/stripe/topup-session", {
        amountRON: Number.parseFloat(fundAmount),
      })

      if (response.data?.url) {
        setShowAddFundsModal(false)
        setFundAmount("")
        await WebBrowser.openBrowserAsync(response.data.url)
      } else {
        Alert.alert("Eroare", "Nu s-a putut genera sesiunea Stripe")
      }
    } catch (error) {
      console.error("Eroare Stripe:", error)
      Alert.alert("Eroare", "A apărut o problemă la conectarea cu Stripe")
    } finally {
      setAddingFunds(false)
    }
  }

  const confirmLogout = () => {
    Alert.alert("Deconectare", "Sigur doriți să vă deconectați?", [
      { text: "Anulează", style: "cancel" },
      { text: "Deconectare", style: "destructive", onPress: handleLogout },
    ])
  }

  const onAddVehicle = () => {
    console.log("🟡 S-a apăsat Adaugă:", newPlate)
    handleAddVehicle(newPlate, setVehicles, vehicles, setNewPlate)
  }

  const onDeleteVehicle = (id) => {
    handleDeleteVehicle(id, setVehicles, vehicles)
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFC00" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#121212", "#1A1A1A"]} style={styles.header}>
        <Text style={styles.title}>Profil</Text>

        {/* Info utilizator */}
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.username}>Utilizator: {user.username}</Text>
            <Text style={styles.balance}>Balanță: {balance !== null ? `${balance} RON` : "Loading..."}</Text>
            <TouchableOpacity style={styles.addFundsBtn} onPress={() => setShowAddFundsModal(true)}>
              <Text style={styles.addFundsBtnText}>+ Adaugă fonduri</Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Buton rezervări */}
        <TouchableOpacity style={styles.reservationsBtn} onPress={() => navigation.navigate("MyReservations")}>
          <Text style={styles.reservationsBtnText}>Rezervările mele</Text>
        </TouchableOpacity>

        {/* Secțiunea vehicule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Numere de înmatriculare</Text>

          <View style={styles.addVehicleRow}>
            <TextInput
              placeholder="Adaugă număr nou"
              value={newPlate}
              onChangeText={setNewPlate}
              style={styles.plateInput}
            />
            <TouchableOpacity onPress={onAddVehicle}>
              <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          {vehicles.map((vehicle) => (
            <View key={vehicle.id} style={styles.vehicleRow}>
              <Text style={styles.plateText}>{vehicle.plateNumber}</Text>
              <TouchableOpacity onPress={() => onDeleteVehicle(vehicle.id)}>
                <Ionicons name="trash-outline" size={18} color="#FF5252" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Buton logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={confirmLogout}>
          <Text style={styles.logoutText}>Deconectare</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Versiune 1.0.0</Text>
      </ScrollView>

      {/* Modal pentru adăugare fonduri */}
      <Modal visible={showAddFundsModal} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Adaugă fonduri</Text>

            <TextInput
              style={styles.amountInput}
              placeholder="Introduceți suma"
              value={fundAmount}
              onChangeText={setFundAmount}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAddFundsModal(false)}>
                <Text>Anulează</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.confirmBtn} onPress={handleAddFunds} disabled={addingFunds}>
                {addingFunds ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.confirmBtnText}>Adaugă</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomToolbar navigation={navigation} activeScreen="Profile" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  userInfo: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 10,
  },
  username: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  balance: {
    color: "#FFFC00",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addFundsBtn: {
    backgroundColor: "#FFFC00",
    padding: 8,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  addFundsBtnText: {
    color: "#121212",
    fontSize: 12,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingBottom: 100,
  },
  reservationsBtn: {
    backgroundColor: "#4CAF50",
    padding: 15,
    margin: 20,
    borderRadius: 8,
  },
  reservationsBtnText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  addVehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  plateInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    marginRight: 10,
  },
  vehicleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  plateText: {
    fontSize: 16,
  },
  logoutBtn: {
    backgroundColor: "#FFF0F0",
    padding: 15,
    margin: 20,
    borderRadius: 8,
  },
  logoutText: {
    color: "#FF5252",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  versionText: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginBottom: 20,
  },
  
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  amountInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelBtn: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  confirmBtn: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  confirmBtnText: {
    color: "white",
    fontWeight: "bold",
  },
})

"use client"

import { ScrollView, View, Text, StyleSheet, TouchableOpacity, RefreshControl } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useCallback, useEffect } from "react"
import ParkingSpotList from "../components/ParkingSpotList"
import EarningsSummary from "../components/EarningsSummary"
import ActiveClientsList from "../components/ActiveClientsList"
import BottomToolbar from "../components/BottomToolbar"
import api from "../services/api"

export default function OwnerDashboard({ navigation }) {
  const [refreshing, setRefreshing] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)

  const fetchWalletBalance = async () => {
    try {
      const response = await api.get("/wallet")
      setWalletBalance(response.data.balance || 0)
    } catch (error) {
      console.error("❌ Eroare la fetch wallet:", error)
      setWalletBalance(0)
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchWalletBalance()
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  useEffect(() => {
    fetchWalletBalance()
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4CAF50"]} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <View style={styles.walletCard}>
            <View style={styles.walletInfo}>
              <Text style={styles.walletLabel}>Sold portofel</Text>
              <Text style={styles.walletValue}>{walletBalance} RON</Text>
            </View>
            <TouchableOpacity style={styles.withdrawButton}>
              <Ionicons name="cash-outline" size={20} color="#FFFFFF" />
              <Text style={styles.withdrawText}>Retrage</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Locuri de parcare</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("AddParkingSpot")}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <ParkingSpotList />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sumar venituri</Text>
          <EarningsSummary showOnlyEarnings />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clienți activi</Text>
          <ActiveClientsList />
        </View>
      </ScrollView>

      <BottomToolbar navigation={navigation} activeScreen="Dashboard" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    fontFamily: "EuclidCircularB-Bold",
  },
  walletCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  walletInfo: {
    flex: 1,
  },
  walletLabel: {
    fontSize: 14,
    color: "#CCCCCC",
    marginBottom: 8,
    fontFamily: "EuclidCircularB-Regular",
  },
  walletValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFC00",
    fontFamily: "EuclidCircularB-Bold",
  },
  withdrawButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 16,
  },
  withdrawText: {
    color: "#FFFFFF",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "EuclidCircularB-Medium",
  },
  section: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#121212",
    marginBottom: 16,
    fontFamily: "EuclidCircularB-Bold",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
})

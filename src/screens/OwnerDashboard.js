"use client"

import { ScrollView, View, Text, StyleSheet, TouchableOpacity, RefreshControl } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useCallback } from "react"
import ParkingSpotList from "../components/ParkingSpotList"
import EarningsSummary from "../components/EarningsSummary"
import ActiveClientsList from "../components/ActiveClientsList"
import BottomToolbar from "../components/BottomToolbar"

export default function OwnerDashboard({ navigation }) {
  const [refreshing, setRefreshing] = useState(false)
  const [periodFilter, setPeriodFilter] = useState("month") // 'day', 'week', 'month', 'year'

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    // Wait for 1 second to simulate refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4CAF50"]} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Venituri</Text>
          <View style={styles.earningsCard}>
            <View style={styles.earningsInfo}>
              <Text style={styles.earningsLabel}>Total Venituri</Text>
              <EarningsSummary />
            </View>
            <View style={styles.earningsPeriod}>
              <TouchableOpacity style={styles.periodSelector}>
                <Text style={styles.periodText}>Luna aceasta</Text>
                <Ionicons name="chevron-down" size={16} color="#FFFC00" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Locuri de parcare</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                // This would typically navigate to a screen to add a new parking spot
                // For now, just show an alert
                alert("Funcționalitatea de adăugare va fi disponibilă în curând")
              }}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <ParkingSpotList />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sumar venituri</Text>
          <EarningsSummary />
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
    paddingBottom: 80, // Reduced to accommodate smaller toolbar
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
  earningsCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  earningsInfo: {
    flex: 1,
  },
  earningsLabel: {
    fontSize: 14,
    color: "#CCCCCC",
    marginBottom: 8,
    fontFamily: "EuclidCircularB-Regular",
  },
  earningsValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFC00",
    fontFamily: "EuclidCircularB-Bold",
  },
  earningsPeriod: {
    alignItems: "flex-end",
  },
  periodSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333333",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  periodText: {
    color: "#FFFC00",
    marginRight: 6,
    fontSize: 12,
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

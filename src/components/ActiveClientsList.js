"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import api from "../services/api"

export default function ActiveClientsList() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActiveClients = async () => {
      try {
        const res = await api.get("/reservations/active-clients")
        // Ensure we're handling the actual API response structure
        setClients(
          Array.isArray(res.data)
            ? res.data.map((client) => ({
                licensePlate: client.licensePlate || "Necunoscut",
                parkingSpot: client.parkingSpotName || client.parkingSpot || "Necunoscut",
                startTime: client.startTime || "Necunoscut",
                duration: client.duration || "Necunoscut",
              }))
            : [],
        )
      } catch (error) {
        console.error("Eroare la fetch active clients:", error)
        setClients([])
      } finally {
        setLoading(false)
      }
    }

    fetchActiveClients()
  }, [])

  const renderItem = ({ item }) => (
    <View style={styles.clientCard}>
      <View style={styles.clientInfo}>
        <Text style={styles.licensePlate}>{item.licensePlate}</Text>
        <View style={styles.spotBadge}>
          <Text style={styles.spotText}>{item.parkingSpot}</Text>
        </View>
      </View>
      <View style={styles.timeInfo}>
        <View style={styles.timeItem}>
          <Ionicons name="time-outline" size={16} color="#4CAF50" style={styles.icon} />
          <Text style={styles.timeText}>{item.startTime}</Text>
        </View>
        <View style={styles.timeItem}>
          <Ionicons name="hourglass-outline" size={16} color="#4CAF50" style={styles.icon} />
          <Text style={styles.timeText}>{item.duration}</Text>
        </View>
      </View>
    </View>
  )

  if (loading) {
    return <ActivityIndicator size="small" color="#4CAF50" />
  }

  return (
    <FlatList
      data={clients}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      scrollEnabled={false}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nu există clienți activi</Text>
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  clientCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  clientInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  licensePlate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "EuclidCircularB-Bold",
  },
  spotBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  spotText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "EuclidCircularB-Bold",
  },
  timeInfo: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  icon: {
    marginRight: 4,
  },
  timeText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "EuclidCircularB-Regular",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
    fontFamily: "EuclidCircularB-Regular",
  },
})

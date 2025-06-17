import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function BottomToolbar({ navigation, activeScreen }) {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.toolbarContainer, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("Map")}>
          <Ionicons
            name={activeScreen === "Map" ? "map" : "map-outline"}
            size={22}
            color={activeScreen === "Map" ? "#FFFC00" : "#9E9E9E"}
          />
          <Text style={[styles.label, activeScreen === "Map" && styles.activeLabel]}>Rezervari</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("Dashboard")}>
          <Ionicons
            name={activeScreen === "Dashboard" ? "bar-chart" : "bar-chart-outline"}
            size={22}
            color={activeScreen === "Dashboard" ? "#4CAF50" : "#9E9E9E"}
          />
          <Text style={[styles.label, activeScreen === "Dashboard" && styles.activeLabelGreen]}>Venituri</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("Profile")}>
          <Ionicons
            name={activeScreen === "Profile" ? "person" : "person-outline"}
            size={22}
            color={activeScreen === "Profile" ? "#FFFC00" : "#9E9E9E"}
          />
          <Text style={[styles.label, activeScreen === "Profile" && styles.activeLabel]}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  toolbarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    zIndex: 1000,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 28,
    paddingVertical: 10,
    paddingHorizontal: 24,
    width: "100%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    minHeight: 48,
  },
  label: {
    fontSize: 10,
    marginTop: 4,
    color: "#9E9E9E",
    fontFamily: "EuclidCircularB-Medium",
  },
  activeLabel: {
    color: "#FFFC00",
    fontFamily: "EuclidCircularB-Bold",
  },
  activeLabelGreen: {
    color: "#4CAF50",
    fontFamily: "EuclidCircularB-Bold",
  },
})

import { ScrollView, View, Text, StyleSheet } from "react-native";
import ParkingSpotList from "../components/ParkingSpotList";
import EarningsSummary from "../components/EarningsSummary";
import ActiveClientsList from "../components/ActiveClientsList";

export default function OwnerDashboard() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back, John Doe</Text>
        <Text style={styles.subtitle}>Total Earnings: $1,250.00</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Parking Spots</Text>
        <ParkingSpotList />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Earnings Summary</Text>
        <EarningsSummary />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Clients</Text>
        <ActiveClientsList />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginTop: 5,
  },
  section: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
})


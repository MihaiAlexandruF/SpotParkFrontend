import { View, Text, StyleSheet, FlatList } from "react-native";

const activeClients = [
  { id: "1", licensePlate: "ABC123", parkingSpot: "Spot A1", startTime: "2023-04-10 14:30" },
  { id: "2", licensePlate: "XYZ789", parkingSpot: "Spot C3", startTime: "2023-04-10 15:45" },
  { id: "3", licensePlate: "DEF456", parkingSpot: "Spot D4", startTime: "2023-04-10 16:15" },
]

export default function ActiveClientsList() {
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.licensePlate}>{item.licensePlate}</Text>
      <Text style={styles.parkingSpot}>{item.parkingSpot}</Text>
      <Text style={styles.startTime}>{item.startTime}</Text>
    </View>
  )

  return (
    <FlatList
      data={activeClients}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={() => (
        <View style={styles.header}>
          <Text style={styles.headerText}>License Plate</Text>
          <Text style={styles.headerText}>Spot</Text>
          <Text style={styles.headerText}>Start Time</Text>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontWeight: "bold",
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  licensePlate: {
    flex: 1,
  },
  parkingSpot: {
    flex: 1,
  },
  startTime: {
    flex: 1,
  },
})


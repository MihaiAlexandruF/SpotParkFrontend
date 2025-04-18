import { View, Text, StyleSheet } from "react-native"

const earningsData = [
  { name: "Spot A1", total: 150 },
  { name: "Spot B2", total: 0 },
  { name: "Spot C3", total: 200 },
  { name: "Spot D4", total: 175 },
]

export default function EarningsSummary() {
  const maxEarnings = Math.max(...earningsData.map((spot) => spot.total))

  return (
    <View style={styles.container}>
      {earningsData.map((spot, index) => (
        <View key={index} style={styles.barContainer}>
          <Text style={styles.barLabel}>{spot.name}</Text>
          <View style={styles.barWrapper}>
            <View style={[styles.bar, { width: `${(spot.total / maxEarnings) * 100}%` }]} />
            <Text style={styles.barValue}>${spot.total}</Text>
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  barContainer: {
    marginBottom: 15,
  },
  barLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  barWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 20,
  },
  bar: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 10,
  },
  barValue: {
    marginLeft: 10,
    fontSize: 14,
  },
})


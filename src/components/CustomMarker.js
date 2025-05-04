import { View, Text, StyleSheet } from "react-native"

export default function CustomMarker({ price }) {
  return (
    <View style={styles.markerContainer}>
      <View style={styles.marker}>
        <Text style={styles.text}>{price} RON</Text>
      </View>
      <View style={styles.pointer} />
    </View>
  )
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
  },
  marker: {
    backgroundColor: "#FFFC00",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  text: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 12,
    fontFamily: "EuclidCircularB-Bold",
  },
  pointer: {
    width: 10,
    height: 10,
    backgroundColor: "#FFFC00",
    transform: [{ rotate: "45deg" }],
    marginTop: -5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
})

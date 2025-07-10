import { View, Text, StyleSheet, Platform } from "react-native";

export default function CustomMarker({ price }) {
  return (
    <View style={styles.markerContainer}>
      <View style={styles.marker}>
        <Text style={styles.text}>{price}lei</Text>
      </View>
      <View style={styles.pointer} />
    </View>
  );
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 8,
      },
    }),
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CustomMarker({ price }) {
  return (
    <View style={styles.marker}>
      <Text style={styles.text}>{price} RON</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  marker: {
    backgroundColor: "#00aaff",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});

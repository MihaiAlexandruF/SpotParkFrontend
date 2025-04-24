import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BottomToolbar({ navigation }) {
  return (
    <View style={styles.toolbar}>
      <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}> 
        <Ionicons name="home" size={24} color="#333" />
        <Text style={styles.label}>Acasă</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}> 
        <Ionicons name="person" size={24} color="#333" />
        <Text style={styles.label}>Profil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  label: {
    fontSize: 12,
    textAlign: "center",
  },
});

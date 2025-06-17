import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../auth/AuthContext";

export default function PaymentSelector({ selectedMethod, onSelectMethod, price }) {
  const { user } = useContext(AuthContext);
  const balance = user?.balance || 0;
  const isBalanceInsufficient = balance < price;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Metodă de plată</Text>

      <View style={styles.balanceContainer}>
        <View style={styles.balanceInfo}>
          <Ionicons name="wallet-outline" size={20} color={isBalanceInsufficient ? "#FF5252" : "#4CAF50"} />
          <Text style={[styles.balanceLabel, isBalanceInsufficient && styles.balanceLabelInsufficient]}>
            Balanță disponibilă:
          </Text>
          <Text style={[styles.balanceValue, isBalanceInsufficient && styles.balanceValueInsufficient]}>
            {balance.toFixed(2)} RON
          </Text>
        </View>
        {isBalanceInsufficient && (
          <Text style={styles.insufficientWarning}>
            Balanță insuficientă pentru această rezervare
          </Text>
        )}
      </View>

      <View style={styles.methodsContainer}>
        <TouchableOpacity
          style={[styles.methodOption, selectedMethod === "balance" && styles.selectedMethod]}
          onPress={() => onSelectMethod("balance")}
          disabled={isBalanceInsufficient}
        >
          <View style={styles.methodInfo}>
            <Ionicons
              name="wallet-outline"
              size={24}
              color={selectedMethod === "balance" ? "#4CAF50" : "#000"}
            />
            <View style={styles.methodDetails}>
              <Text style={[styles.methodName, selectedMethod === "balance" && styles.selectedMethodText]}>
                Din balanță
              </Text>
              <Text style={[styles.methodDescription, selectedMethod === "balance" && styles.selectedMethodText]}>
                {isBalanceInsufficient ? "Balanță insuficientă" : "Folosește balanța disponibilă"}
              </Text>
            </View>
          </View>
          {selectedMethod === "balance" && <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodOption, selectedMethod === "card" && styles.selectedMethod]}
          onPress={() => onSelectMethod("card")}
        >
          <View style={styles.methodInfo}>
            <Ionicons
              name="card-outline"
              size={24}
              color={selectedMethod === "card" ? "#4CAF50" : "#000"}
            />
            <View style={styles.methodDetails}>
              <Text style={[styles.methodName, selectedMethod === "card" && styles.selectedMethodText]}>
                Card bancar
              </Text>
              <Text style={[styles.methodDescription, selectedMethod === "card" && styles.selectedMethodText]}>
                Plătește cu cardul
              </Text>
            </View>
          </View>
          {selectedMethod === "card" && <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    fontFamily: "EuclidCircularB-Medium",
  },
  balanceContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  balanceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    marginRight: 4,
    fontFamily: "EuclidCircularB-Regular",
  },
  balanceLabelInsufficient: {
    color: "#FF5252",
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
    fontFamily: "EuclidCircularB-Medium",
  },
  balanceValueInsufficient: {
    color: "#FF5252",
  },
  insufficientWarning: {
    color: "#FF5252",
    fontSize: 12,
    marginTop: 8,
    fontFamily: "EuclidCircularB-Regular",
  },
  methodsContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  methodOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  selectedMethod: {
    backgroundColor: "#F0F0F0",
  },
  methodInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  methodDetails: {
    marginLeft: 12,
    flex: 1,
  },
  methodName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
    fontFamily: "EuclidCircularB-Medium",
  },
  methodDescription: {
    fontSize: 13,
    color: "#666",
    fontFamily: "EuclidCircularB-Regular",
  },
  selectedMethodText: {
    color: "#4CAF50",
  },
});
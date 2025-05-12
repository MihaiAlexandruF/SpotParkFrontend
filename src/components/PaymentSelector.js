import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PaymentSelector({ userBalance, selectedMethod, onSelectMethod, price }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const selectMethod = (method) => {
    onSelectMethod(method);
    setIsExpanded(false);
  };

  const insufficientBalance = userBalance < price;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Metodă de plată</Text>

      {/* Selector Compact */}
      <TouchableOpacity style={styles.selector} onPress={toggleExpand} activeOpacity={0.7}>
        <View style={styles.selectedMethod}>
          <View style={styles.methodIcon}>
            <Ionicons name={selectedMethod === "balance" ? "wallet-outline" : "card-outline"} size={20} color="#000" />
          </View>
          <View style={styles.methodDetails}>
            <Text style={styles.methodName}>
              {selectedMethod === "balance" ? "Plată din balanță" : "Plată cu cardul"}
            </Text>
            {selectedMethod === "balance" && (
              <Text style={[styles.methodInfo, insufficientBalance && styles.insufficientBalance]}>
                {insufficientBalance ? "Balanță insuficientă" : `Balanță: ${userBalance} RON`}
              </Text>
            )}
          </View>
        </View>
        <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#777" />
      </TouchableOpacity>

      {/* Opțiuni extinse */}
      {isExpanded && (
        <View style={styles.expandedOptions}>
          <TouchableOpacity
            style={[styles.option, selectedMethod === "balance" && styles.selectedOption]}
            onPress={() => selectMethod("balance")}
            disabled={selectedMethod === "balance"}
          >
            <Ionicons name="wallet-outline" size={20} color="#000" />
            <View style={styles.optionDetails}>
              <Text style={styles.optionName}>Plată din balanță</Text>
              <Text style={[styles.optionInfo, insufficientBalance && styles.insufficientBalance]}>
                {insufficientBalance ? "Balanță insuficientă" : `Balanță: ${userBalance} RON`}
              </Text>
            </View>
            {selectedMethod === "balance" && <Ionicons name="checkmark" size={20} color="#4CAF50" />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, selectedMethod === "card" && styles.selectedOption]}
            onPress={() => selectMethod("card")}
            disabled={selectedMethod === "card"}
          >
            <Ionicons name="card-outline" size={20} color="#000" />
            <View style={styles.optionDetails}>
              <Text style={styles.optionName}>Plată cu cardul</Text>
              <Text style={styles.optionInfo}>Visa •••• 4242</Text>
            </View>
            {selectedMethod === "card" && <Ionicons name="checkmark" size={20} color="#4CAF50" />}
          </TouchableOpacity>
        </View>
      )}
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
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  selectedMethod: {
    flexDirection: "row",
    alignItems: "center",
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEEEEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    fontFamily: "EuclidCircularB-Medium",
  },
  methodInfo: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
    fontFamily: "EuclidCircularB-Regular",
  },
  insufficientBalance: {
    color: "#E53935",
  },
  expandedOptions: {
    marginTop: 8,
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  selectedOption: {
    backgroundColor: "#F0F0F0",
  },
  optionDetails: {
    flex: 1,
    marginLeft: 12,
  },
  optionName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
    fontFamily: "EuclidCircularB-Medium",
  },
  optionInfo: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
    fontFamily: "EuclidCircularB-Regular",
  },
})
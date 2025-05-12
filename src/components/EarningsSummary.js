import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import api from "../services/api";

export default function EarningsSummary() {
  const [earnings, setEarnings] = useState([]);
  const [total, setTotal] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const [perParkingRes, totalRes, walletRes] = await Promise.all([
          api.get("/earnings/per-parking"),
          api.get("/earnings/total"),
          api.get("/wallet"),
        ]);

        setEarnings(Array.isArray(perParkingRes.data) ? perParkingRes.data : []);
        setTotal(totalRes.data.total || 0);
        setWalletBalance(walletRes.data.balance || 0);
      } catch (error) {
        console.error("❌ Eroare la fetch earnings:", error);
        setEarnings([]);
        setTotal(0);
        setWalletBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) {
    return <ActivityIndicator size="small" color="#4CAF50" />;
  }

  if (earnings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nu există date despre venituri</Text>
      </View>
    );
  }

  const maxTotal = Math.max(...earnings.map((e) => e.total || 0), 1);

  return (
    <View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Sold portofel</Text>
        <Text style={styles.totalValue}>{walletBalance} RON</Text>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total venituri</Text>
        <Text style={styles.totalValue}>{total} RON</Text>
      </View>

      {earnings.map((spot, idx) => (
        <View key={idx} style={styles.barContainer}>
          <View style={styles.barHeader}>
            <Text style={styles.barLabel}>{spot.name}</Text>
            <Text style={styles.barValue}>{spot.total} RON</Text>
          </View>
          <View style={styles.barWrapper}>
            <View
              style={[
                styles.bar,
                {
                  width: `${(spot.total / maxTotal) * 100}%`,
                  backgroundColor: spot.total > 0 ? "#4CAF50" : "#E0E0E0",
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}


const styles = StyleSheet.create({
  totalContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: "#999",
    fontFamily: "EuclidCircularB-Regular",
  },
  totalValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFC00",
    fontFamily: "EuclidCircularB-Bold",
  },
  barContainer: {
    marginBottom: 16,
  },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  barLabel: {
    fontSize: 14,
    color: "#333",
    fontFamily: "EuclidCircularB-Medium",
  },
  barValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
    fontFamily: "EuclidCircularB-Bold",
  },
  barWrapper: {
    height: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 5,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "EuclidCircularB-Regular",
  },
})

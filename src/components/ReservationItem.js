import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ReservationItem({ data, active = false }) {
  const [remaining, setRemaining] = useState("");
  const [isExpired, setIsExpired] = useState(false);


  const convertToUTCPlus3 = (utcTimeString) => {
    const utcDate = new Date(utcTimeString);
    const utcPlus3Date = new Date(utcDate.getTime() + (3 * 60 * 60 * 1000));
    return utcPlus3Date;
  };

 useEffect(() => {
  if (!active) return;

  const updateTimer = () => {
    const endTime = new Date(data.endTime);
    endTime.setHours(endTime.getHours() + 3); // compensează ora București

    const now = new Date();
    const diff = endTime - now;

    if (diff <= 0) {
      setRemaining("00:00:00");
      setIsExpired(true);
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    setRemaining(formattedTime);
    setIsExpired(false);
  };

  updateTimer();
  const interval = setInterval(updateTimer, 1000);

  return () => clearInterval(interval);
}, [data.endTime, active]);


  const formatHour = (utcTimeString) => {
    const utcPlus3Date = convertToUTCPlus3(utcTimeString);
    return utcPlus3Date.toLocaleTimeString("ro-RO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={[styles.card, active && styles.activeCard]}>
      <View style={styles.header}>
        <Text style={styles.label}>{data.address}</Text>
        {active && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>ACTIV</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.subLabel}>
        🕐 {formatHour(data.startTime)} - {formatHour(data.endTime)}
      </Text>
      
      <Text style={styles.subLabel}>
        💰 {data.totalCost} RON
      </Text>
      
      {active && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Timp rămas:</Text>
          <Text style={[styles.timerText, isExpired && styles.expiredTimer]}>
            {isExpired ? "EXPIRAT" : remaining}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E1E",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  activeCard: {
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
  },
  statusBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  subLabel: {
    fontSize: 15,
    color: "#CCCCCC",
    marginTop: 6,
    lineHeight: 20,
  },
  timerContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    alignItems: "center",
  },
  timerLabel: {
    fontSize: 14,
    color: "#AAAAAA",
    marginBottom: 4,
  },
  timerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    fontFamily: "monospace",
    letterSpacing: 2,
  },
  expiredTimer: {
    color: "#FF5252",
    fontSize: 18,
  },
});
import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import ImageCarousel from "./ImageCarousel";
import { useAnimation } from '../utils/animationUtils';

export default function ParkingCard({ spot, onClose, onOpenReservationSheet }) { 
  const { fadeAnim, slideAnim } = useAnimation();

  const handleReservePress = () => {
    onOpenReservationSheet(spot);
  };
const renderScheduleInfo = () => {
  const schedules = spot.availabilitySchedules;

  if (!schedules || schedules.length === 0) {
    return (
      <View style={styles.scheduleInfo}>
        <Text style={styles.scheduleTitle}>Program</Text>
        <Text style={styles.scheduleText}>Non-stop</Text>
      </View>
    );
  }

  const type = schedules[0].availabilityType;

  if (type === "always") {
    return (
      <View style={styles.scheduleInfo}>
        <Text style={styles.scheduleTitle}>Program</Text>
        <Text style={styles.scheduleText}>Non-stop</Text>
      </View>
    );
  }

  if (type === "daily") {
    const daily = schedules[0];
    return (
      <View style={styles.scheduleInfo}>
        <Text style={styles.scheduleTitle}>Program zilnic</Text>
        <Text style={styles.scheduleText}>
          {daily.openTime?.slice(0, 5)} - {daily.closeTime?.slice(0, 5)}
        </Text>
      </View>
    );
  }

  if (type === "weekly") {
    const dayNames = {
      monday: "Luni", tuesday: "Marți", wednesday: "Miercuri",
      thursday: "Joi", friday: "Vineri", saturday: "Sâmbătă", sunday: "Duminică"
    };

    const weeklyDays = schedules.filter(s => s.availabilityType === "weekly");

    return (
      <View style={styles.scheduleInfo}>
        <Text style={styles.scheduleTitle}>Program săptămânal</Text>
        {weeklyDays.map((s, idx) => (
          <Text key={idx} style={styles.scheduleText}>
            {dayNames[s.dayOfWeek?.toLowerCase()] || s.dayOfWeek}: {s.openTime?.slice(0, 5)} - {s.closeTime?.slice(0, 5)}
          </Text>
        ))}
      </View>
    );
  }

  return null;
};



  console.log("🔍 spot.images:", spot.images)

  return (
    <Animated.View style={[styles.cardWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.card}>
        {spot.images && (
          <ImageCarousel
            images={spot.images
              .map(img => typeof img === "string" ? img : img?.imageUrl)
              .filter(Boolean)
              .slice(0, 3)
            }
          />
        )}


        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
          <BlurView intensity={30} tint="light" style={styles.blurButton}>
            <Ionicons name="close" size={20} color="#ff0000" />
          </BlurView>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>{spot.name}</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={18} color="#000" style={styles.icon} />
              <Text style={styles.infoText}>{spot.address}</Text>
            </View>

            <View style={styles.priceTag}>
              <Text style={styles.price}>{spot.price} RON</Text>
              <Text style={styles.priceUnit}>/oră</Text>
            </View>
          </View>

         {renderScheduleInfo()} 

          <TouchableOpacity
            style={styles.reserveButton}
            onPress={handleReservePress}
            activeOpacity={0.9}
          >
            <Text style={styles.reserveText}>Continuă rezervarea</Text>
            <Ionicons name="arrow-forward" size={18} color="#000" style={styles.reserveIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

function Feature({ icon, label }) {
  return (
    <View style={styles.feature}>
      <Ionicons name={icon} size={16} color="#4CAF50" />
      <Text style={styles.featureText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 120 : 80, 
    left: 20,
    right: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  blurButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
    fontFamily: "EuclidCircularB-Bold",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 16,
  },
  icon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
    fontFamily: "EuclidCircularB-Regular",
  },
  priceTag: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "#F9F9F9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "EuclidCircularB-Bold",
  },
  priceUnit: {
    fontSize: 14,
    color: "#777",
    marginLeft: 2,
    fontFamily: "EuclidCircularB-Regular",
  },
  features: {
    flexDirection: "row",
    marginBottom: 24,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
    marginRight: 8,
  },
  featureText: {
    fontSize: 12,
    color: "#333",
    marginLeft: 4,
    fontFamily: "EuclidCircularB-Medium",
  },
  reserveButton: {
    backgroundColor: "#FFFC00",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FFFC00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  reserveText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "EuclidCircularB-Bold",
  },
  reserveIcon: {
    marginLeft: 8,
  },

  scheduleInfo: {
  marginBottom: 20,
},
scheduleTitle: {
  fontSize: 14,
  fontWeight: "bold",
  color: "#000",
  fontFamily: "EuclidCircularB-Bold",
  marginBottom: 4,
},
scheduleText: {
  fontSize: 13,
  color: "#333",
  fontFamily: "EuclidCircularB-Regular",
},
});
"use client"

import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import ImageCarousel from "./ImageCarousel"
import { BlurView } from "expo-blur"
import { useRef, useEffect } from "react"

export default function ParkingCard({ spot, onClose, onReserve }) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.card}>
        {/* Image Carousel */}
        {spot.images && <ImageCarousel images={spot.images} />}

        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
          <BlurView intensity={30} tint="light" style={styles.blurButton}>
            <Ionicons name="close" size={20} color="#000" />
          </BlurView>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>{spot.name}</Text>

          {/* Info Items */}
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

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.feature}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>Securizat</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="flash-outline" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>Rapid</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="star-outline" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>4.8</Text>
            </View>
          </View>

          {/* Reserve Button */}
          <TouchableOpacity style={styles.reserveButton} onPress={onReserve} activeOpacity={0.9}>
            <Text style={styles.reserveText}>Rezervă acum</Text>
            <Ionicons name="arrow-forward" size={18} color="#000" style={styles.reserveIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    position: "absolute",
    bottom: 90,
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
})

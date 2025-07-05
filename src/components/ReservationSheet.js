import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Alert,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  ScrollView,
  Dimensions,
  StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PaymentSelector from "./PaymentSelector";
import VehicleSelector from "./VehicleSelector";
import { AuthContext } from "../auth/AuthContext";
import { reserveParking } from "../services/parkingService";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.5;

export default function ReservationSheet({ spot, onClose, onReserve, userBalance = 0 }) {
  const { user } = useContext(AuthContext);
  const savedVehicles = user?.vehicles || [];

  console.log(" user din context:", user);


  const [paymentMethod, setPaymentMethod] = useState("balance");
  const [selectedVehicle, setSelectedVehicle] = useState(savedVehicles[0] || null);
  const [isReserving, setIsReserving] = useState(false);
  const [hours, setHours] = useState(1);

  const sheetAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(sheetAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(backgroundOpacity, { toValue: 0.5, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

const handleReserve = () => {
  if (!selectedVehicle) return;
  const finalHours = hours || 1;
  const payload = {
    parkingLotId: spot.id,
    plateId: selectedVehicle.id,
    paymentMethod,
    hours: finalHours,
  };
  setIsReserving(true);
  onReserve(payload);
};



  const decreaseHours = () => hours > 1 && setHours(hours - 1);
  const increaseHours = () => hours < 24 && setHours(hours + 1);
  const totalPrice = spot.price * hours;

  const swipeProgress = swipeAnim.interpolate({
    inputRange: [0, SWIPE_THRESHOLD, SCREEN_WIDTH],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  });

  const swipeBackgroundColor = swipeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(76, 175, 80, 0.2)", "rgba(76, 175, 80, 1)"],
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) swipeAnim.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          Animated.timing(swipeAnim, { toValue: SCREEN_WIDTH, duration: 200, useNativeDriver: true }).start(() => {
            handleReserve();
          });
        } else {
          Animated.spring(swipeAnim, { toValue: 0, friction: 5, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(sheetAnim, { toValue: SCREEN_HEIGHT, duration: 300, useNativeDriver: true }),
      Animated.timing(backgroundOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(onClose);
  };

  return (
    <>
      <Animated.View style={[styles.background, { opacity: backgroundOpacity }]} onTouchStart={handleClose} />
      <Animated.View style={[styles.sheetContainer, { transform: [{ translateY: sheetAnim }] }]}>
        <View>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#777" />
          </TouchableOpacity>
          <View style={styles.spotSummary}>
            <View style={styles.spotInfo}>
              <Text style={styles.spotName}>{spot.name}</Text>
              <Text style={styles.spotAddress}>{spot.address}</Text>
            </View>
            <View style={styles.spotPrice}>
              <Text style={styles.priceValue}>{spot.price} RON</Text>
              <Text style={styles.priceUnit}>/oră</Text>
            </View>
          </View>

          <View style={styles.hoursSection}>
            <Text style={styles.sectionTitle}>Durată parcare</Text>
            <View style={styles.hoursSelector}>
              <TouchableOpacity style={[styles.hourButton, hours <= 1 && styles.hourButtonDisabled]} onPress={decreaseHours} disabled={hours <= 1}>
                <Ionicons name="remove" size={20} color={hours <= 1 ? "#CCC" : "#000"} />
              </TouchableOpacity>
              <View style={styles.hoursDisplay}>
                <Text style={styles.hoursValue}>{hours}</Text>
                <Text style={styles.hoursUnit}>{hours === 1 ? "oră" : "ore"}</Text>
              </View>
              <TouchableOpacity style={[styles.hourButton, hours >= 24 && styles.hourButtonDisabled]} onPress={increaseHours} disabled={hours >= 24}>
                <Ionicons name="add" size={20} color={hours >= 24 ? "#CCC" : "#000"} />
              </TouchableOpacity>
            </View>
            <View style={styles.totalPrice}>
              <Text style={styles.totalPriceLabel}>Total:</Text>
              <Text style={styles.totalPriceValue}>{totalPrice} RON</Text>
            </View>
          </View>

          <ScrollView style={styles.selectorsContainer} contentContainerStyle={styles.selectorsContent} showsVerticalScrollIndicator={false}>
            <VehicleSelector vehicles={savedVehicles} selectedVehicle={selectedVehicle} onSelectVehicle={setSelectedVehicle} />
            <PaymentSelector userBalance={userBalance} selectedMethod={paymentMethod} onSelectMethod={setPaymentMethod} price={totalPrice} />
          </ScrollView>

          <View style={styles.swipeContainer}>
            {isReserving ? (
              <View style={styles.reservingContainer}>
                <Text style={styles.reservingText}>Se procesează rezervarea...</Text>
              </View>
            ) : (
              <>
                <Animated.View style={[styles.swipeBackground, { backgroundColor: swipeBackgroundColor }]} />
                <View style={styles.swipeTrack}>
                  <Animated.View {...panResponder.panHandlers} style={[styles.swipeThumb, { transform: [{ translateX: swipeAnim }] }]}>
                    <Ionicons name="arrow-forward" size={24} color="#fff" />
                  </Animated.View>
                  <Text style={styles.swipeText}>Glisează pentru a rezerva</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Animated.View>
    </>
  );
}


const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  sheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 10,
  },
  spotSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  spotInfo: {
    flex: 1,
  },
  spotName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  spotAddress: {
    fontSize: 14,
    color: "#777",
  },
  spotPrice: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "#F9F9F9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  priceUnit: {
    fontSize: 12,
    color: "#777",
    marginLeft: 2,
  },
  hoursSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  hoursSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    padding: 8,
    marginBottom: 12,
  },
  hourButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEEEEE",
    justifyContent: "center",
    alignItems: "center",
  },
  hourButtonDisabled: {
    backgroundColor: "#F5F5F5",
  },
  hoursDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  hoursValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  hoursUnit: {
    fontSize: 16,
    color: "#777",
    marginLeft: 4,
  },
  totalPrice: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0FFF0",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  totalPriceLabel: {
    fontSize: 16,
    color: "#4CAF50",
  },
  totalPriceValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  selectorsContainer: {
    maxHeight: SCREEN_HEIGHT * 0.3,
  },
  selectorsContent: {
    padding: 24,
    paddingBottom: 32,
  },
  swipeContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  swipeBackground: {
    position: "absolute",
    top: 16,
    left: 24,
    right: 24,
    height: 56,
    borderRadius: 28,
  },
  swipeTrack: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  swipeThumb: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  swipeText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  reservingContainer: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 28,
  },
  reservingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

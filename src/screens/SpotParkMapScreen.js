import { useEffect, useState, useRef, useContext } from "react"
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { getAvailableSpots, getParkingDetailsById } from "../services/parkingService"
import SearchBar from "../components/SearchBar"
import ParkingCard from "../components/ParkingCard"
import BottomToolbar from "../components/BottomToolbar"
import CustomMarker from "../components/CustomMarker"
import { Ionicons } from "@expo/vector-icons"
import { AuthContext } from "../auth/AuthContext"
import ReservationSheet from "../components/ReservationSheet"
import { reserveParking } from "../services/parkingService"
import ReservationSuccessModal from "../components/ReservationSuccessModal"


export default function SpotParkMapScreen({ navigation }) {
  const [spots, setSpots] = useState([])
  const [selectedSpot, setSelectedSpot] = useState(null)
  const [reservationSheetSpot, setReservationSheetSpot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchedLocation, setSearchedLocation] = useState(null)
  const mapRef = useRef()
  const { user } = useContext(AuthContext);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastReservationInfo, setLastReservationInfo] = useState({ duration: 1, price: 0 });



  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const data = await getAvailableSpots()
        setSpots(data)
      } catch (error) {
        console.error("❌ Eroare la fetch parcuri:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSpots()
  }, [])

  const handleReservationConfirmed = async (reservationData) => {
    try {
      const reservation = await reserveParking(reservationData);

      setLastReservationInfo({
        duration: reservationData.hours,
        price: reservation.totalCost
      });

      setShowSuccessModal(true);
      setReservationSheetSpot(null);
      setSelectedSpot(null);
    } catch (error) {
      Alert.alert(
        "Eroare",
        error?.response?.data?.message || "A apărut o eroare la rezervare."
      );
    }
  };



  const handleMarkerPress = async (spot) => {
    try {
      const details = await getParkingDetailsById(spot.parkingLotId);
      setSelectedSpot(details);
    } catch (error) {
      console.warn("❌ Eroare la încărcarea detaliilor parcării:", error);
      Alert.alert("Eroare", "Nu s-au putut încărca detaliile parcării.");
    }
  };


  const shouldShowToolbar = !selectedSpot && !reservationSheetSpot

  const handleSearch = ({ latitude, longitude, label }) => {
    setSearchedLocation({ latitude, longitude, label })
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 800)
    }
    setSelectedSpot(null)
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FFFC00" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 44.4268,
          longitude: 26.1025,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {spots.map((spot) =>
          typeof spot.latitude === "number" &&
            typeof spot.longitude === "number" ? (
            <Marker
              key={spot.parkingLotId}
              coordinate={{
                latitude: spot.latitude,
                longitude: spot.longitude,
              }}
              onPress={() => handleMarkerPress(spot)}
              anchor={{ x: 0.5, y: 1 }}
            >
              <CustomMarker price={spot.pricePerHour} />
            </Marker>
          ) : null
        )}

        {searchedLocation && (
          <Marker
            coordinate={{
              latitude: searchedLocation.latitude,
              longitude: searchedLocation.longitude,
            }}
            pinColor="#FFFC00"
            title={searchedLocation.label}
          />
        )}
      </MapView>

      <SearchBar onSearch={handleSearch} />

      <TouchableOpacity style={styles.locationButton}>
        <Ionicons name="locate" size={24} color="#121212" />
      </TouchableOpacity>

      {selectedSpot && (
        <ParkingCard
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
          onOpenReservationSheet={(spot) => setReservationSheetSpot(spot)}
        />
      )}

      {reservationSheetSpot && (
        <ReservationSheet
          spot={reservationSheetSpot}
          onClose={() => setReservationSheetSpot(null)}
          onReserve={handleReservationConfirmed}
          userBalance={user?.balance || 0}
        />
      )}

      <ReservationSuccessModal
        visible={showSuccessModal}
        duration={lastReservationInfo.duration}
        price={lastReservationInfo.price}
        onClose={() => setShowSuccessModal(false)}
        onViewReservations={() => {
          setShowSuccessModal(false);
          navigation.navigate("MyReservations");
        }}
      />

      {shouldShowToolbar && (
        <BottomToolbar navigation={navigation} activeScreen="Map" />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  locationButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#FFFC00",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
})

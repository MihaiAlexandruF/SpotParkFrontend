"use client"

import { useEffect, useState } from "react"
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { getParkingSpots } from "../services/parkingService"
import SearchBar from "../components/SearchBar"
import ParkingCard from "../components/ParkingCard"
import BottomToolbar from "../components/BottomToolbar"
import CustomMarker from "../components/CustomMarker"
import { Ionicons } from "@expo/vector-icons"
import ReservationSheet from "../components/ReservationSheet";

// Custom map style for a minimalist look
const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#dadada",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#e9e9e9",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
]

// Sample parking spot data with images
const sampleImages = [
  [
    "https://images.unsplash.com/photo-1590674899484-d5640e854abe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1590674899484-d5640e854abe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1590674899484-d5640e854abe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  ],
]

export default function SpotParkMapScreen({ navigation }) {
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [reservationSheetSpot, setReservationSheetSpot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const data = await getParkingSpots();
        const spotsWithImages = data.map((spot, index) => ({
          ...spot,
          images: sampleImages[index % sampleImages.length],
        }));
        setSpots(spotsWithImages);
      } catch (error) {
        console.error("❌ Eroare la fetch parcuri:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpots();
  }, []);

  const handleReservationConfirmed = (reservationData) => {
    console.log("Rezervare confirmată:", reservationData);
    Alert.alert("Succes", `Ai rezervat ${reservationData.parkingLotId} cu ${reservationData.plateId} prin ${reservationData.paymentMethod}`);
    setReservationSheetSpot(null);
    setSelectedSpot(null);
  };

  const shouldShowToolbar = !selectedSpot && !reservationSheetSpot

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FFFC00" />
      </View>
    );
  }

 return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        //customMapStyle={mapStyle}
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
          typeof spot.lat === "number" && typeof spot.lng === "number" && (
            <Marker
  key={spot.id}
  coordinate={{ latitude: spot.lat, longitude: spot.lng }}
  onPress={() => setSelectedSpot(spot)}
  anchor={{ x: 0.5, y: 1 }}
>
  <CustomMarker price={spot.price} />
</Marker>




          )
        )}
      </MapView>

      <SearchBar />

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
          userBalance={150}  // Sau din API
          savedVehicles={[{ id: "1", registrationNumber: "B123ABC", isDefault: true }]}  // Sau din API
        />
      )}

      {shouldShowToolbar && <BottomToolbar navigation={navigation} activeScreen="Map" />}
    </View>
  )
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

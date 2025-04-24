
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getParkingSpots } from "../services/parkingService";
import SearchBar from "../components/SearchBar";
import ParkingCard from "../components/ParkingCard.js";
import BottomToolbar from "../components/BottomToolbar";
import CustomMarker from "../components/CustomMarker";

export default function SpotParkMapScreen({ navigation }) {
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const data = await getParkingSpots();
        setSpots(data);
      } catch (error) {
        console.error("Eroare la fetch parcuri:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpots();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 44.4268,
          longitude: 26.1025,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={spot.coordinate}
            onPress={() => setSelectedSpot(spot)}
          >
            <CustomMarker price={spot.price} />
          </Marker>
        ))}
      </MapView>

      <SearchBar />
      {selectedSpot && <ParkingCard spot={selectedSpot} onClose={() => setSelectedSpot(null)} />}
      <BottomToolbar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

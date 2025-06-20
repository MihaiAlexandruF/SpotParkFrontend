import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const LocationPicker = ({
  mapRef,
  location,
  draggableMarkerCoords,
  setDraggableMarkerCoords,
  onAddressChange,
}) => {
  const [mapCenter, setMapCenter] = useState(draggableMarkerCoords);
  const [addressLoading, setAddressLoading] = useState(false);
  const debounceTimer = useRef(null);

  const fetchAddress = async (lat, lon) => {
    setAddressLoading(true);
    try {
      const res = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      const feature = data?.features?.[0];
      const label = feature?.properties?.label || `${feature?.properties?.name || ''}, ${feature?.properties?.city || ''}`;
      onAddressChange?.(label);
    } catch (e) {
      onAddressChange?.('');
    } finally {
      setAddressLoading(false);
    }
  };

  const onRegionChangeComplete = (region) => {
    const coords = {
      latitude: region.latitude,
      longitude: region.longitude,
    };
    setMapCenter(coords);
    setDraggableMarkerCoords(coords);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchAddress(coords.latitude, coords.longitude);
    }, 2000);
  };

  const centerMapOnMarker = () => {
    mapRef.current?.animateToRegion({
      ...draggableMarkerCoords,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Locație</Text>
      <Text style={styles.sectionSubtitle}>Mutați harta pentru a selecta locația exactă</Text>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={location}
          showsUserLocation
          showsMyLocationButton
          showsCompass
          showsScale
          onRegionChangeComplete={onRegionChangeComplete}
        >
          <Marker coordinate={mapCenter} pinColor="#4CAF50" />
        </MapView>

        <View style={styles.centerMarker} />

        <TouchableOpacity style={styles.centerMapButton} onPress={centerMapOnMarker}>
          <BlurView intensity={80} tint="light" style={styles.centerMapButtonInner}>
            <Ionicons name="locate" size={20} color="#000000" />
          </BlurView>
        </TouchableOpacity>
      </View>

      <View style={styles.coordsContainer}>
        <Text style={styles.coordsText}>
          Lat: {mapCenter.latitude.toFixed(6)}, Lng: {mapCenter.longitude.toFixed(6)}
        </Text>
        {addressLoading && (
          <Text style={styles.loadingText}>Căutare adresă...</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 8,
    fontFamily: 'EuclidCircularB-Bold',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
    fontFamily: 'EuclidCircularB-Regular',
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  map: {
    width: Dimensions.get("window").width - 32,
    height: 200,
  },
  centerMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 24,
    height: 24,
    marginLeft: -12,
    marginTop: -12,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
    zIndex: 1,
  },
  centerMapButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    zIndex: 10,
  },
  centerMapButtonInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  coordsContainer: {
    alignItems: 'center',
  },
  coordsText: {
    fontSize: 12,
    color: '#757575',
    fontFamily: 'EuclidCircularB-Regular',
  },
  loadingText: {
    marginTop: 4,
    fontSize: 11,
    color: '#999',
    fontFamily: 'EuclidCircularB-Regular',
  },
});

export default LocationPicker;

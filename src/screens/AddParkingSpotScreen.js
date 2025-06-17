"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Text,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { createParkingSpot } from "../services/parkingService"
import { useNavigation } from "@react-navigation/native"
import api from "../services/api"

// Import components
import { uploadParkingImage } from "../services/parkingService";
import Header from "../components/parking/Header"
import ImageUploader from "../components/parking/ImageUploader"
import ParkingDetails from "../components/parking/ParkingDetails"
import LocationPicker from "../components/parking/LocationPicker"
import SubmitButton from "../components/parking/SubmitButton"
import ScheduleSelectorModal from "../components/parking/ScheduleSelectorModal"

const SchedulePreview = ({ scheduleData }) => {
  const translateDay = {
    monday: "Luni",
    tuesday: "Marți",
    wednesday: "Miercuri",
    thursday: "Joi",
    friday: "Vineri",
    saturday: "Sâmbătă",
    sunday: "Duminică"
  };

  if (!scheduleData) return null;

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={styles.scheduleInfo}>
        <Text style={styles.scheduleTitle}>Program selectat</Text>
  
        {scheduleData.scheduleType === "always" && (
          <Text style={styles.scheduleText}>Disponibil non-stop</Text>
        )}
  
  {scheduleData.scheduleType === "daily" && scheduleData.dailyHours?.start && scheduleData.dailyHours?.end && (
  <Text style={styles.scheduleText}>
    Zilnic între {scheduleData.dailyHours.start} - {scheduleData.dailyHours.end}
  </Text>
)}


  
{scheduleData.scheduleType === "weekly" &&
  ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    .filter((day) => scheduleData.weeklySchedule?.[day]?.active)
    .map((day) => (
      <Text key={day} style={styles.scheduleText}>
        {translateDay[day]}: {scheduleData.weeklySchedule[day].start} - {scheduleData.weeklySchedule[day].end}
      </Text>
    ))}

      </View>
    </View>
  );
  
};



export default function AddParkingSpotScreen() {
  const navigation = useNavigation()

  // Form state
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [price, setPrice] = useState("")
  const [images, setImages] = useState([])
  const [location, setLocation] = useState({
    latitude: 44.4268,
    longitude: 26.1025,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  })
  const [draggableMarkerCoords, setDraggableMarkerCoords] = useState({
    latitude: 44.4268,
    longitude: 26.1025,
  })
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false)
  const [scheduleData, setScheduleData] = useState({
    scheduleType: "normal",
    dailyHours: { start: "09:00", end: "18:00" },
    weeklySchedule: {
      monday: { active: true, start: "09:00", end: "17:00" },
      tuesday: { active: true, start: "09:00", end: "17:00" },
      wednesday: { active: true, start: "09:00", end: "17:00" },
      thursday: { active: true, start: "09:00", end: "17:00" },
      friday: { active: true, start: "09:00", end: "17:00" },
      saturday: { active: false, start: "10:00", end: "16:00" },
      sunday: { active: false, start: "10:00", end: "16:00" },
    }
  })

  // Refs
  const mapRef = useRef(null)
  const scrollViewRef = useRef(null)

  // Request permissions on component mount
  useEffect(() => {
    ;(async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== "granted") {
          Alert.alert("Permisiune necesară", "Avem nevoie de acces la galeria foto pentru a încărca imagini.")
        }
      }
    })()
  }, [])

  // Handle form submission
  const handleSubmit = async () => {
    if (!name.trim()) return Alert.alert("Câmp obligatoriu", "Introduceți numele parcării.");
    if (!address.trim()) return Alert.alert("Câmp obligatoriu", "Introduceți adresa.");
    if (!price.trim() || isNaN(Number(price))) return Alert.alert("Câmp obligatoriu", "Preț invalid.");
    if (images.length === 0) return Alert.alert("Imagini necesare", "Încărcați cel puțin o imagine.");

    setLoading(true);

    try {
      const parkingData = {
        description: name.trim(),
        address: address.trim(),
        pricePerHour: Number(price),
        latitude: draggableMarkerCoords.latitude,
        longitude: draggableMarkerCoords.longitude,
        availability: {
          availabilityType: scheduleData.scheduleType === "normal" ? "daily" : scheduleData.scheduleType,
          dailyOpenTime: scheduleData.dailyHours?.start || "09:00",
          dailyCloseTime: scheduleData.dailyHours?.end || "18:00",
          weeklySchedules: scheduleData.scheduleType === "weekly"
            ? Object.entries(scheduleData.weeklySchedule)
                .filter(([_, value]) => value.active)
                .map(([day, value]) => ({
                  dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1).toLowerCase(),
                  openTime: value.start,
                  closeTime: value.end
                }))
            : []
        }
      };

      console.log("Creating parking spot with data:", JSON.stringify(parkingData, null, 2));
      const response = await createParkingSpot(parkingData);
      console.log("Parking spot created:", response);

      // Upload images one by one
      for (const imageUri of images) {
        try {
          await uploadParkingImage(response.parkingLotId, imageUri);
        } catch (error) {
          console.error("Error uploading image:", error);
          // Continue with other images even if one fails
        }
      }

      Alert.alert("Succes", "Parcarea a fost adăugată cu succes!", [
        {
          text: "OK",
          onPress: () => navigation.navigate('MainTabs', { screen: 'Home', params: { refresh: true } })
        }
      ]);
    } catch (error) {
      console.error("Eroare creare parcare:", error);
      Alert.alert(
        "Eroare", 
        error.response?.data?.message || "A apărut o eroare la crearea parcării."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSave = (incomingData) => {
    const scheduleType = incomingData.availabilityType;
  
    const completeData = {
      scheduleType,
      dailyHours:
        scheduleType === "daily" && incomingData.dailyOpenTime && incomingData.dailyCloseTime
          ? {
              start: incomingData.dailyOpenTime,
              end: incomingData.dailyCloseTime
            }
          : undefined,
      weeklySchedule:
        scheduleType === "weekly"
          ? {
              monday: { active: false, start: "09:00", end: "17:00" },
              tuesday: { active: false, start: "09:00", end: "17:00" },
              wednesday: { active: false, start: "09:00", end: "17:00" },
              thursday: { active: false, start: "09:00", end: "17:00" },
              friday: { active: false, start: "09:00", end: "17:00" },
              saturday: { active: false, start: "10:00", end: "16:00" },
              sunday: { active: false, start: "10:00", end: "16:00" },
              ...Object.fromEntries(
                (incomingData.weeklySchedules || []).map((d) => [
                  d.dayOfWeek.toLowerCase(),
                  {
                    active: true,
                    start: d.openTime,
                    end: d.closeTime
                  }
                ])
              )
            }
          : undefined
    };
  
    setScheduleData(completeData);
    setScheduleModalVisible(false);
  };
  
  
  // Mock function to simulate image upload - replace with actual implementation
  const uploadImages = async (imageUris) => {
    // In a real app, you would upload each image to your server/cloud storage
    // and return the URLs
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        // Return mock URLs
        resolve(imageUris.map((_, index) => `https://example.com/parking-image-${index}-${Date.now()}.jpg`))
      }, 1500)
    })
  }

  // Funcție pentru a afișa programul selectat
  const renderScheduleInfo = () => {
    if (!scheduleData) return null;
  
    const translateDay = {
      monday: "Luni",
      tuesday: "Marți",
      wednesday: "Miercuri",
      thursday: "Joi",
      friday: "Vineri",
      saturday: "Sâmbătă",
      sunday: "Duminică"
    };
  
    return (
      <View style={styles.scheduleInfo}>
        <Text style={styles.scheduleTitle}>Program selectat</Text>
  
        {scheduleData.scheduleType === "always" && (
          <Text style={styles.scheduleText}>Disponibil non-stop</Text>
        )}
  
        {scheduleData.scheduleType === "normal" && (
          <Text style={styles.scheduleText}>
            Zilnic între {scheduleData.dailyHours?.start || "09:00"} - {scheduleData.dailyHours?.end || "18:00"}
          </Text>
        )}
  
        {scheduleData.scheduleType === "weekly" &&
          Object.entries(scheduleData.weeklySchedule)
            .filter(([_, value]) => value.active)
            .map(([day, value]) => (
              <Text key={day} style={styles.scheduleText}>
                {translateDay[day]}: {value.start} - {value.end}
              </Text>
            ))}
      </View>
    );
  };
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <Header onBackPress={() => navigation.goBack()} />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ImageUploader images={images} setImages={setImages} />
        
        <ParkingDetails
          name={name}
          setName={setName}
          address={address}
          setAddress={setAddress}
          price={price}
          setPrice={setPrice}
          onSchedulePress={() => setScheduleModalVisible(true)}
          scheduleType={scheduleData.scheduleType}
          scheduleData={scheduleData}
        />

<SchedulePreview scheduleData={scheduleData} />




        <LocationPicker
          mapRef={mapRef}
          location={location}
          draggableMarkerCoords={draggableMarkerCoords}
          setDraggableMarkerCoords={setDraggableMarkerCoords}
          address={address}
        />

        <SubmitButton
          loading={loading}
          uploadingImages={uploadingImages}
          onPress={handleSubmit}
        />
      </ScrollView>

      <ScheduleSelectorModal
        visible={scheduleModalVisible}
        initialSchedule={scheduleData}
        onClose={() => setScheduleModalVisible(false)}
        onSave={handleScheduleSave}
      />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  scheduleInfo: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  scheduleTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  scheduleText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
}) 
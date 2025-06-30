import api from "./api"

// Update the saveAvailability function to match the backend API
export const saveAvailability = async (parkingLotId, scheduleData) => {
  try {
    // Transform the data to match what the backend expects
    const apiData = {
      availabilityType: scheduleData.availabilityType,
      dailyOpenTime: scheduleData.dailyOpenTime,
      dailyCloseTime: scheduleData.dailyCloseTime,
      weeklySchedules: scheduleData.weeklySchedules,
    }

    const { data } = await api.put(`/parking/${parkingLotId}/availability`, apiData)
    console.log("✅ Disponibilitate salvată:", data)
    return data
  } catch (error) {
    console.error("❌ Eroare la salvarea disponibilității:", error)
    throw error
  }
}

export const toggleParkingSpot = async (parkingLotId) => {
  try {
    const { data } = await api.put(`/parking/${parkingLotId}/toggle-active`);
    return data;
  } catch (error) {
    console.error("❌ Eroare la toggle:", error);
    throw error;
  }
};



// Update the getMyParkingSpots function to properly handle the API response

export const getMyParkingSpots = async () => {
  try {
    const { data } = await api.get("/parking/my-spots");

    if (!Array.isArray(data)) {
      console.error("❌ Răspunsul API nu este un array:", data);
      return [];
    }

    const spotsMapped = data.map((spot) => ({
      id: spot.parkingLotId,
      name: spot.description || "Parcare fără nume",
      address: spot.address || "",
      active: spot.isActive === undefined ? true : spot.isActive,
      pricePerHour: spot.pricePerHour || 0,
      latitude: spot.latitude,
      longitude: spot.longitude,
      imageUrls: spot.imageUrls || [],
      earnings: spot.earnings || 0,

      scheduleType:
        spot.availabilitySchedules && spot.availabilitySchedules.length > 0
          ? spot.availabilitySchedules[0].availabilityType
          : "normal",

      dailyHours:
        spot.availabilitySchedules &&
        spot.availabilitySchedules.length > 0 &&
        spot.availabilitySchedules[0].availabilityType === "daily"
          ? {
              start: spot.availabilitySchedules[0].openTime || "08:00",
              end: spot.availabilitySchedules[0].closeTime || "20:00",
            }
          : { start: "08:00", end: "20:00" },

      weeklySchedule:
        spot.availabilitySchedules && spot.availabilitySchedules.length > 0
          ? transformWeeklySchedules(spot.availabilitySchedules)
          : null,
    }));

    return spotsMapped;
  } catch (error) {
    console.error("❌ Eroare la încărcarea parcărilor utilizatorului:", error);
    return [];
  }
};

// ✅ Transformare robustă pentru orar săptămânal
const transformWeeklySchedules = (weeklySchedules) => {
  const defaultSchedule = {
    monday: { active: false, start: "09:00", end: "17:00" },
    tuesday: { active: false, start: "09:00", end: "17:00" },
    wednesday: { active: false, start: "09:00", end: "17:00" },
    thursday: { active: false, start: "09:00", end: "17:00" },
    friday: { active: false, start: "09:00", end: "17:00" },
    saturday: { active: false, start: "10:00", end: "16:00" },
    sunday: { active: false, start: "10:00", end: "16:00" },
  };

  weeklySchedules.forEach((schedule) => {
    const day = schedule.dayOfWeek?.toLowerCase?.();
    if (day && defaultSchedule[day]) {
      defaultSchedule[day] = {
        active: true,
        start: schedule.openTime || "09:00",
        end: schedule.closeTime || "17:00",
      };
    }
  });

  return defaultSchedule;
};



export const getParkingSpots = async () => {
  try {
    const { data } = await api.get("/parking")
    return data.map((spot) => ({
      id: spot.parkingLotId,
      name: spot.description || "Parcare",
      address: spot.address,
      price: spot.pricePerHour,
      lat: spot.latitude,
      lng: spot.longitude,
      // In a real app, these would come from the API
      images: [
        "https://images.unsplash.com/photo-1590674899484-d5640e854abe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      ],
    }))
  } catch (error) {
    console.error("Error fetching parking spots:", error)
    // Return some fallback data for testing
    return [
      {
        id: "1",
        name: "Parcare Centrală",
        address: "Strada Lipscani 21, București",
        price: 10,
        lat: 44.4268,
        lng: 26.1025,
        images: [
          "https://images.unsplash.com/photo-1590674899484-d5640e854abe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        id: "2",
        name: "Parcare Universitate",
        address: "Piața Universității, București",
        price: 8,
        lat: 44.435,
        lng: 26.1025,
        images: [
          "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1590674899484-d5640e854abe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        id: "3",
        name: "Parcare Unirii",
        address: "Bulevardul Unirii 15, București",
        price: 12,
        lat: 44.428,
        lng: 26.11,
        images: [
          "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1590674899484-d5640e854abe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        ],
      },
    ]
  }
}


export const getAvailableSpots = async () => {
  const { data } = await api.get("/parking/map-preview");
  return data;
};


export const createParkingSpot = async (parkingData) => {
  const { data } = await api.post("/parking/parking", {
    address: parkingData.address,
    description: parkingData.description,
    pricePerHour: parkingData.pricePerHour,
    latitude: parkingData.latitude,
    longitude: parkingData.longitude,
    availabilityType: parkingData.availability.availabilityType,
    dailyOpenTime: parkingData.availability.dailyOpenTime,
    dailyCloseTime: parkingData.availability.dailyCloseTime,
    weeklySchedules: parkingData.availability.weeklySchedules
  });

  return data;
};

export const uploadParkingImage = async (parkingLotId, imageUri) => {
  const formData = new FormData();
  formData.append("files", {
    uri: imageUri,
    name: `photo_${Date.now()}.jpg`,
    type: "image/jpeg"
  });

  const { data } = await api.post(`/parking/${parkingLotId}/images/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return data;
};

const renderScheduleInfo = () => {
  if (!scheduleData) return null;

  // Acceptă și availabilityType și scheduleType
  const type = scheduleData.scheduleType || scheduleData.availabilityType;

  if (type === "always") {
    return (
      <View style={styles.scheduleInfo}>
        <Text style={styles.scheduleTitle}>Program</Text>
        <Text style={styles.scheduleText}>Non-stop</Text>
      </View>
    );
  }

  if (type === "normal" || type === "daily") {
    // Acceptă dailyHours sau dailyOpenTime/dailyCloseTime
    const start = scheduleData.dailyHours?.start || scheduleData.dailyOpenTime || "09:00";
    const end = scheduleData.dailyHours?.end || scheduleData.dailyCloseTime || "18:00";
    return (
      <View style={styles.scheduleInfo}>
        <Text style={styles.scheduleTitle}>Program zilnic</Text>
        <Text style={styles.scheduleText}>{start} - {end}</Text>
      </View>
    );
  }

  if (type === "weekly") {
    // Acceptă weeklySchedule (obiect) sau weeklySchedules (array)
    let days = [];
    if (Array.isArray(scheduleData.weeklySchedules)) {
      days = scheduleData.weeklySchedules
        .filter(d => d.active !== false) // acceptă și fără active
        .map(d => ({
          day: d.dayOfWeek || d.day || "",
          start: d.openTime || d.start,
          end: d.closeTime || d.end
        }));
    } else if (scheduleData.weeklySchedule) {
      days = Object.entries(scheduleData.weeklySchedule)
        .filter(([_, v]) => v.active)
        .map(([day, v]) => ({
          day,
          start: v.start,
          end: v.end
        }));
    }
    const dayNames = {
      monday: "Luni", tuesday: "Marți", wednesday: "Miercuri", thursday: "Joi",
      friday: "Vineri", saturday: "Sâmbătă", sunday: "Duminică"
    };
    return (
      <View style={styles.scheduleInfo}>
        <Text style={styles.scheduleTitle}>Program săptămânal</Text>
        {days.map(({ day, start, end }) => (
          <Text key={day} style={styles.scheduleText}>
            {(dayNames[day?.toLowerCase()] || day)}: {start} - {end}
          </Text>
        ))}
      </View>
    );
  }

  return null;
};


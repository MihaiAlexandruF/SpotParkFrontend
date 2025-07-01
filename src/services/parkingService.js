import api from "./api"

export const saveAvailability = async (parkingLotId, scheduleData) => {
  try {
    
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






export const getAvailableSpots = async () => {
  const { data } = await api.get("/parking/map-preview");
  return data;
};



export const getParkingDetailsById = async (id) => {
  const { data } = await api.get(`/parking/${id}/details`);
  console.log("Parcare vine cu", data);

  return {
    id: data.parkingLotId,
    name: data.description || "Parcare",
    address: data.address,
    price: data.pricePerHour,
    lat: data.latitude,
    lng: data.longitude,
    images: data.images?.map(img => img.imageUrl) || [],
    availabilitySchedules: data.availabilitySchedules || [],
  };
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


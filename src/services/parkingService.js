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

// Update the getMyParkingSpots function to properly handle the API response
export const getMyParkingSpots = async () => {
  try {
    const { data } = await api.get("/parking/my-spots")

    if (!Array.isArray(data)) {
      console.error("❌ Răspunsul API nu este un array:", data)
      return []
    }

    return data
  } catch (error) {
    console.error("❌ Eroare la încărcarea parcărilor utilizatorului:", error)
    return []
  }
}

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

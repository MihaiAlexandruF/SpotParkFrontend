import { View, TextInput, StyleSheet, TouchableOpacity, FlatList, Text, Pressable, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useRef } from "react"

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef();

  const handleChange = (text) => {
    setQuery(text);
    setSuggestions([]);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.length < 3) return;

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(text)}&limit=5`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data.features || []);
        })
        .catch(() => setSuggestions([]))
        .finally(() => setLoading(false));
    }, 1300);
  };

  const formatLabel = (properties) => {
    return properties.label ||
      [
        properties.name,
        properties.street,
        properties.suburb,
        properties.city,
        properties.postcode,
        properties.country
      ]
        .filter(Boolean)
        .join(", ");
  };

  const handleSelect = (item) => {
    const label = formatLabel(item.properties);
    setQuery(label);
    setSuggestions([]);
    if (onSearch) {
      onSearch({
        latitude: item.geometry.coordinates[1],
        longitude: item.geometry.coordinates[0],
        label,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Caută o adresă..."
          style={styles.input}
          placeholderTextColor="#999"
          value={query}
          onChangeText={handleChange}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#FFFC00" />
        </TouchableOpacity>
      </View>

      {(loading || suggestions.length > 0) && (
        <View style={styles.suggestionsContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFFC00" style={{ margin: 10 }} />
          ) : (
            <FlatList
              data={suggestions}
              keyExtractor={(item, idx) => `${item.properties.osm_type}_${item.properties.osm_id}_${idx}`}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.suggestionItem,
                    pressed && styles.suggestionItemPressed,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.suggestionText}>{formatLabel(item.properties)}</Text>
                </Pressable>
              )}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#333",
    fontSize: 15,
    fontFamily: "EuclidCircularB-Regular",
  },
  filterButton: {
    padding: 8,
  },
  suggestionsContainer: {
    backgroundColor: "#fafafc",
    borderRadius: 12,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 6,
    maxHeight: 220,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: '#ececec',
  },
  suggestionItem: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  suggestionItemPressed: {
    backgroundColor: "#f3f3f7",
  },
  suggestionText: {
    color: "#222",
    fontSize: 15,
    fontFamily: "EuclidCircularB-Regular",
    letterSpacing: 0.1,
  },
});

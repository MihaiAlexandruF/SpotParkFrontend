"use client"

import { useState, useRef, useEffect } from "react"
import { View, Image, StyleSheet, Dimensions, ActivityIndicator, Animated, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"

const { width } = Dimensions.get("window")
const CARD_WIDTH = width - 40 // Accounting for horizontal padding

export default function ImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState({})
  const flatListRef = useRef(null)
  const scrollX = useRef(new Animated.Value(0)).current

  // Track loading state for each image separately
  useEffect(() => {
    if (images) {
      const initialLoadingState = {}
      images.forEach((_, index) => {
        initialLoadingState[index] = true
      })
      setLoading(initialLoadingState)
    }
  }, [images])

  const handleImageLoad = (index) => {
    setLoading((prev) => ({ ...prev, [index]: false }))
  }

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 }

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index)
    }
  }).current

  const goToSlide = (index) => {
    if (flatListRef.current && index >= 0 && index < images?.length) {
      flatListRef.current.scrollToIndex({ index, animated: true })
    }
  }

  const renderItem = ({ item, index }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} onLoad={() => handleImageLoad(index)} />
      {loading[index] && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      )}
    </View>
  )

  if (!images || images.length === 0) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Ionicons name="image-outline" size={32} color="#CCCCCC" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH,
          offset: CARD_WIDTH * index,
          index,
        })}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH}
        snapToAlignment="center"
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      />

      {/* Navigation arrows with blur effect */}
      {images.length > 1 && (
        <>
          {currentIndex > 0 && (
            <TouchableOpacity
              style={[styles.navButton, styles.leftNavButton]}
              onPress={() => goToSlide(currentIndex - 1)}
              activeOpacity={0.8}
            >
              <BlurView intensity={30} tint="dark" style={styles.blurButton}>
                <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
              </BlurView>
            </TouchableOpacity>
          )}

          {currentIndex < images.length - 1 && (
            <TouchableOpacity
              style={[styles.navButton, styles.rightNavButton]}
              onPress={() => goToSlide(currentIndex + 1)}
              activeOpacity={0.8}
            >
              <BlurView intensity={30} tint="dark" style={styles.blurButton}>
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </BlurView>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Modern pagination indicator */}
      {images.length > 1 && (
        <View style={styles.paginationContainer}>
          <BlurView intensity={40} tint="dark" style={styles.paginationBlur}>
            <View style={styles.pagination}>
              {images.map((_, index) => {
                const inputRange = [(index - 1) * CARD_WIDTH, index * CARD_WIDTH, (index + 1) * CARD_WIDTH]

                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.5, 1, 0.5],
                  extrapolate: "clamp",
                })

                const scale = scrollX.interpolate({
                  inputRange,
                  outputRange: [1, 1.3, 1],
                  extrapolate: "clamp",
                })

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => goToSlide(index)}
                    style={styles.dotTouchable}
                    activeOpacity={0.7}
                  >
                    <Animated.View
                      style={[
                        styles.paginationDot,
                        {
                          opacity,
                          transform: [{ scale }],
                          backgroundColor: index === currentIndex ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                        },
                      ]}
                    />
                  </TouchableOpacity>
                )
              })}
            </View>
          </BlurView>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 240,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: CARD_WIDTH,
    height: 240,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  navButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -18 }],
    zIndex: 10,
  },
  leftNavButton: {
    left: 16,
  },
  rightNavButton: {
    right: 16,
  },
  blurButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  paginationContainer: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
  },
  paginationBlur: {
    borderRadius: 20,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dotTouchable: {
    padding: 5,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
})

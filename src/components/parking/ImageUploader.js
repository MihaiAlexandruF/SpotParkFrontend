import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';

const ImageUploader = ({ images, setImages }) => {
  const pickImage = async () => {
    if (images.length >= 3) {
      Alert.alert('Limită atinsă', 'Puteți încărca maxim 3 imagini.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Eroare', 'Nu am putut încărca imaginea. Încercați din nou.');
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Fotografii</Text>
      <Text style={styles.sectionSubtitle}>Adaugă până la 3 imagini cu parcarea ta</Text>

      <View style={styles.imageUploadContainer}>
        {images.map((image, index) => (
          <View key={index} style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
              <BlurView intensity={80} tint="dark" style={styles.removeImageButtonInner}>
                <Ionicons name="close" size={16} color="#FFFFFF" />
              </BlurView>
            </TouchableOpacity>
          </View>
        ))}

        {images.length < 3 && (
          <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
            <Ionicons name="add" size={32} color="#CCCCCC" />
            <Text style={styles.addImageText}>Adaugă foto</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
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
  imageUploadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: -5,
  },
  imagePreviewContainer: {
    width: '30%',
    aspectRatio: 1,
    margin: 5,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  removeImageButtonInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  addImageButton: {
    width: '30%',
    aspectRatio: 1,
    margin: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  addImageText: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
    fontFamily: 'EuclidCircularB-Regular',
  },
});

export default ImageUploader; 
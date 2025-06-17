import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SubmitButton = ({ loading, uploadingImages, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.submitButton, (loading || uploadingImages) && styles.submitButtonDisabled]}
      onPress={onPress}
      disabled={loading || uploadingImages}
    >
      {loading || uploadingImages ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#000000" />
          <Text style={styles.submitButtonText}>
            {uploadingImages ? 'Se încarcă imaginile...' : 'Se procesează...'}
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.submitButtonText}>Adaugă parcare</Text>
          <Ionicons name="checkmark" size={20} color="#000000" />
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: '#FFFC00',
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFFC00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#F5F5F5',
    shadowColor: 'transparent',
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    fontFamily: 'EuclidCircularB-Bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SubmitButton; 
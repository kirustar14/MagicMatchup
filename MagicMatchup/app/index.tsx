import { useState } from 'react';
import { View, StyleSheet, Text, Pressable, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const pickImage = async () => {
    // Request permission to access the device's photo library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access photo library required');
      return;
    }

    // Launch the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setShowComparison(false);
    }
  };

  const sampleImageURI = require('../assets/images/sampleImage.jpg');
  
  const handleCompareImage = () => {
    setShowComparison(true);
  };

  return (
<View style={styles.container}>
      {!showComparison && (
        <Pressable onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>Pick Image</Text>
        </Pressable>
      )}
      {!showComparison && image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}
      {!showComparison && image && (
        <Pressable onPress={handleCompareImage} style={styles.button}>
          <Text style={styles.buttonText}>Compare Image</Text>
        </Pressable>
      )}
      {showComparison && (
        <View style={styles.comparisonContainer}>
          {/* User Image */}
          <View style={styles.imageContainer}>
            <Text style={styles.title}>User Version</Text>
            <Image source={{ uri: image }} style={styles.comparisonImage} />
          </View>
          {/* Sample Image */}
          <View style={styles.imageContainer}>
            <Text style={styles.title}>Correct Version</Text>
            <Image source={sampleImageURI} style={styles.comparisonImage} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  button: {
    backgroundColor: '#E6E6FA',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 20,
  },
  buttonText: {
    color: '#4B0082',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 20, // Add horizontal padding
  },
  imageContainer: {
    alignItems: 'center',
  },
  comparisonImage: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ADD8E6',
    marginBottom: 10,
  },
});


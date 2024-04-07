import { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

export default function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [penDetected, setPenDetected] = useState<boolean>(false);
  const [imageMatch, setImageMatch] = useState<boolean | null>(null);

  useEffect(() => {
    tf.ready().then(() => {
      console.log('TensorFlow.js is ready');
    });
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access photo library required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      setShowComparison(false);
      detectPen(result.assets[0].uri);
    }
  };

  const detectPen = async (imageUri: string) => {
    const model = await tf.loadGraphModel(
      'file:///Users/YourUsername/Desktop/model/model.json'
    ) as tf.GraphModel; // Explicitly define the type of the loaded model
    
    const imageTensor = tf.browser.fromPixels({ uri: imageUri });
    const predictions = await model.executeAsync(imageTensor) as { [key: string]: any }[]; // Use executeAsync instead of detect
    
    console.log(predictions); // Log predictions to check for pen detection
    
    if (predictions.some((prediction) => prediction.class === 1)) {
      setPenDetected(true);
    } else {
      setPenDetected(false);
    }
  };

  // Corrected path to sample image URI
  const sampleImageURI = require('../assets/images/sampleImage.png'); 

  const handleCompareImage = () => {
    setShowComparison(true);
    if (!penDetected) {
      setImageMatch(false); // No pen detected, images don't match
    } else {
      setImageMatch(true); // Pen detected, images match
    }
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
            {/* Use sampleImageURI directly */}
            <Image source={sampleImageURI} style={styles.comparisonImage} /> 
          </View>
        </View>
      )}
      {showComparison && imageMatch !== null && (
        <Text style={{ color: imageMatch ? 'lightgreen' : 'lightred' }}>
          {imageMatch ? 'Images Match!' : 'No pen detected, images don\'t match'}
        </Text>
      )}
      {showComparison && penDetected && (
        <Text style={{ color: 'green' }}>Pen detected in the image</Text>
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

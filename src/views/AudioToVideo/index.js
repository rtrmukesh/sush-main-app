import { MaterialIcons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
// import { ProcessingManager } from 'react-native-video-processing'; // Import ProcessingManager
import React, { useEffect, useState } from 'react';
import { Alert, LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AudioToVideo = (props) => {
  const [videoFiles, setVideoFiles] = useState([]);
  const [isGridView, setIsGridView] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need media library permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newFiles = result.assets.filter(
        (newFile) => !videoFiles.some((existingFile) => existingFile.uri === newFile.uri)
      );

      if (newFiles.length < result.assets.length) {
        Alert.alert('Duplicate Files', 'Some files were already added.');
      }

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setVideoFiles([...videoFiles, ...newFiles]);
    }
  };

  const convertVideos = async () => {
    setIsConverting(true);
    const outputDir = `${FileSystem.documentDirectory}Output`;

    const dirInfo = await FileSystem.getInfoAsync(outputDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(outputDir, { intermediates: true });
    }

    for (const video of videoFiles) {
      const { uri } = video;
      const filename = uri.split('/').pop();
      const outputFilePath = `${outputDir}/${filename.split('.').slice(0, -1).join('.')}_audio.m4a`; // Output audio file path

      try {
        // const result = await ProcessingManager.extractAudio(uri, outputFilePath); // Use extractAudio method
        // if (result.status === 'success') {
        //   console.log(`Audio extracted: ${outputFilePath}`);
        // } else {
        //   console.error(`Failed to extract audio: ${result.error}`);
        // }
      } catch (error) {
        console.error(`Error extracting audio: ${error.message}`);
      }
    }

    setIsConverting(false);
    Alert.alert('Conversion Complete', 'All videos have been converted to audio.');
  };

  const deleteVideo = (uri) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setVideoFiles(videoFiles.filter((video) => video.uri !== uri));
  };

  const clearAllVideos = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setVideoFiles([]);
  };

  const toggleLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsGridView(!isGridView);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Video Converter App</Text>
      <TouchableOpacity style={styles.addButton} onPress={pickVideo}>
        <Text style={styles.addButtonText}>Select or Browse Videos</Text>
      </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.videoCount}>Total Videos: {videoFiles.length}</Text>
        {videoFiles.length > 0 && (
          <>
            <TouchableOpacity onPress={clearAllVideos} style={styles.clearButtonContainer}>
              <MaterialIcons name="clear" size={24} color="red" style={styles.clearIcon} />
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toggleLayoutButton} onPress={toggleLayout}>
              <MaterialIcons name={isGridView ? 'view-list' : 'view-module'} size={24} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      </View>
      {isGridView ? (
        <ScrollView contentContainerStyle={styles.gridContainer}>
          {videoFiles.map((item, index) => (
            <View key={index} style={styles.videoItemGrid}>
              <Video
                source={{ uri: item.uri }}
                rate={1.0}
                volume={1.0}
                isMuted={true}
                resizeMode="cover"
                shouldPlay={false}
                style={styles.thumbnailGrid}
              />
              <TouchableOpacity onPress={() => deleteVideo(item.uri)} style={styles.deleteButtonGrid}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.list}>
          {videoFiles.map((item, index) => (
            <View key={index} style={styles.videoItem}>
              <Video
                source={{ uri: item.uri }}
                rate={1.0}
                volume={1.0}
                isMuted={true}
                resizeMode="cover"
                shouldPlay={false}
                style={styles.thumbnail}
              />
              <Text style={styles.fileName}>{decodeURI(item.fileName || item.uri.split('/').pop() || 'Unknown File')}</Text>
              <TouchableOpacity onPress={() => deleteVideo(item.uri)} style={styles.deleteButton}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      {videoFiles.length > 0 && (
        <TouchableOpacity style={styles.convertButton} onPress={convertVideos} disabled={isConverting}>
          <Text style={styles.convertButtonText}>{isConverting ? 'Converting...' : 'Convert'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default AudioToVideo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 5,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  videoCount: {
    fontSize: 18,
  },
  clearButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  clearIcon: {
    marginRight: 5,
  },
  clearAllText: {
    fontSize: 16,
    color: 'red',
    textDecorationLine: 'underline',
  },
  toggleLayoutButton: {
    backgroundColor: '#007BFF',
    padding: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
    width: '100%',
  },
  videoItem: {
    padding: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoItemGrid: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 2,
    position: 'relative',
  },
  thumbnail: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  thumbnailGrid: {
    width: 80,
    height: 80,
    marginBottom: 0,
  },
  fileName: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  deleteButton: {
    marginLeft: 60,
    width: 20,
    height: 20,
  },
  deleteButtonGrid: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  convertButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  convertButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 5,
    width: '100%',
  },
});

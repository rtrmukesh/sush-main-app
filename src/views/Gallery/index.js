import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image, TouchableOpacity, Text, Dimensions, Modal, Button, Alert, AppState } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { MaterialIcons } from '@expo/vector-icons'; // For the 3-dot menu icon
import Layout from '../../MyComponents/Layout';
import DeleteConfirmationModal from '../../components/Modal/DeleteConfirmationModal';

const GalleryDashboard = () => {
  const [albums, setAlbums] = useState([]);
  const [numColumns, setNumColumns] = useState(3);
  const [key, setKey] = useState('numColumns-3');
  const [selectedAlbum, setSelectedAlbum] = useState(null); // Store the selected album for deletion
  const [isModalVisible, setModalVisible] = useState(false); // For confirmation modal

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        fetchAlbums();
      }
    };

    const updateNumColumns = () => {
      const screenWidth = Dimensions.get('window').width;
      let columns = 3;
      if (screenWidth < 400) {
        columns = 2;
      } else if (screenWidth >= 400 && screenWidth < 800) {
        columns = 3;
      } else {
        columns = 4;
      }
      setNumColumns(columns);
      setKey(`numColumns-${columns}`);
    };

    updateNumColumns();
    Dimensions.addEventListener('change', updateNumColumns);
    requestPermission();

    AppState.addEventListener("change", handleAppStateChange);


    return () => {
      Dimensions.removeEventListener('change', updateNumColumns);
      if (AppState.removeEventListener) {
        AppState.removeEventListener("change", handleAppStateChange);
      }
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === "active") {
      setTimeout(async () => {
        await fetchAlbums()
      }, 1000);
    }
  };



  const fetchAlbums = async () => {
    const albums = await MediaLibrary.getAlbumsAsync();
    const updatedAlbums = await Promise.all(
      albums.map(async (album) => {
        const photoCount = await MediaLibrary.getAssetsAsync({
          album: album.id,
          mediaType: ['photo'],
        });
        const videoCount = await MediaLibrary.getAssetsAsync({
          album: album.id,
          mediaType: ['video'],
        });
        const totalMedia = photoCount.totalCount + videoCount.totalCount;

        return {
          ...album,
          cover: photoCount.assets.length > 0 ? photoCount.assets[0].uri : null,
          totalPhotos: photoCount.totalCount,
          totalVideos: videoCount.totalCount,
          totalMedia,
        };
      })
    );
    setAlbums(updatedAlbums);
  };

  const deleteAlbum = async (albumId) => {
    console.log('Attempting to delete album with ID: ', albumId);
    try {
        const result = await MediaLibrary.deleteAlbumsAsync([albumId], true); // true to delete assets on iOS
        if (result) {
            console.log('Album deleted successfully:', result);
            await fetchAlbums(); // Refresh the albums list
        } else {
            console.log('Album deletion failed');
            Alert.alert('Error', 'Failed to delete the album. It might be a system album.');
        }
    } catch (error) {
        console.error("Error deleting album:", error);
        Alert.alert('Error', 'Failed to delete the album. It might be a system album or in use.');
    }
};

  
  
  console.log('albums>>>------------------------> ', albums);

  const confirmDelete = (album) => {
    setSelectedAlbum(album);
    setModalVisible(true); // Show modal for confirmation
  };

  const renderAlbum = ({ item }) => (
    <View style={styles.album}>
      <TouchableOpacity onPress={() => {}}>
        <Image
          source={{ uri: item.cover || 'default_image_uri' }}
          style={styles.albumImage}
        />
      </TouchableOpacity>
      <Text style={styles.albumTitle}>{item.title}</Text>
      <View style={styles.mediaCountsRow}>
        <Text style={styles.mediaCount}>Photos: {item.totalPhotos}</Text>
        <Text style={styles.mediaCount}> | Videos: {item.totalVideos}</Text>
      </View>
      <Text style={styles.totalMediaCount}>Total: {item.totalMedia} items</Text>

      {/* 3-dot menu for delete */}
      <TouchableOpacity
        style={styles.menuIcon}
        onPress={() => confirmDelete(item)} // Show delete confirmation
      >
        <MaterialIcons name="more-vert" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
console.log('selectedAlbum>>>------------------------> ', selectedAlbum);
  return (
    <Layout HeaderLabel={"My Gallery"}>
      <View style={styles.container}>
        <FlatList
          data={albums}
          renderItem={renderAlbum}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          key={key}
          style={styles.albumList}
        />
      </View>

      {/* Delete confirmation modal */}
      {selectedAlbum && (
           <DeleteConfirmationModal
           modalVisible={isModalVisible}
           toggle={() => setModalVisible(false)}
           updateAction={() => deleteAlbum(selectedAlbum?.id)}
           id={selectedAlbum?.title}
       />
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  albumList: {
    marginTop: 10,
  },
  album: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: 'relative', // For positioning menu icon
  },
  albumImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  albumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mediaCountsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  mediaCount: {
    fontSize: 12,
    color: '#6c757d',
  },
  totalMediaCount: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 5,
  },
  menuIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalAlbumTitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default GalleryDashboard;

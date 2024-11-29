import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Layout from '../../../MyComponents/Layout';
import ListCustomLoader from '../../../components/ListCustomLoader';

const AlbumImage = (props) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const screenWidth = Dimensions.get('window').width;
  const columnCount = 3;
  const imageSize = screenWidth / columnCount - 10;

  const navigation = useNavigation();

  useEffect(() => {
    fetchImages(props.route.params.albumId);
  }, [props?.route?.params?.albumId,props?.route?.params?.date]);

  const fetchImages = async (albumId) => {
    if (loading) return; // Prevent multiple fetches at the same time
    setLoading(true);

    try {
        // Fetch all assets in the album or the entire media library
        const response = await MediaLibrary.getAssetsAsync({
            ...(albumId ? { album: albumId } : {}),
            mediaType: ['photo', 'video'], // Fetch both photos and videos
            first: 1000000, // Arbitrary large number to fetch all available assets
        });

        let filteredAssets = response.assets;

        // If a specific date is passed, filter the assets by that date
        if (props?.route?.params?.date) {
            const targetDate = props?.route?.params?.date;
            filteredAssets = filteredAssets.filter((asset) => {
                const assetDate = new Date(asset.creationTime).toISOString().split("T")[0];
                return assetDate === targetDate;
            });
        }

        // Log creation and modification times for debugging
        filteredAssets.forEach((asset) => {
            const creationDate = new Date(asset.creationTime).toISOString();
            const modificationDate = new Date(asset.modificationTime).toISOString();
            console.log(`Asset: ${asset.filename}, Creation Time: ${creationDate}, Modification Time: ${modificationDate}`);
        });

        // Sort the filtered assets by creation time in descending order
        filteredAssets.sort((a, b) => b.modificationTime - a.modificationTime);

        console.log('Sorted Assets:', filteredAssets); // Debugging line
        setImages(filteredAssets); // Set the images state with sorted assets
    } catch (error) {
        console.error('Error fetching assets:', error);
        Alert.alert('Error', 'Failed to load images.');
    }

    setLoading(false); // Stop the loading spinner
};

  

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const renderImage = useCallback(
    ({ item, index }) => (
      <TouchableOpacity onPress={() => openImageModal(index)}>
        <Image
          source={{ uri: item?.uri }}
          style={[styles.image, { width: imageSize, height: imageSize }]}
        />
      </TouchableOpacity>
    ),
    [imageSize]
  );

  return (
    <Layout
      HeaderLabel={props?.route?.params?.albumName}
      onBackPress={() => navigation.navigate('Gallery')}
    >
      {loading ? <ListCustomLoader /> : <View style={styles.container}>
        <FlatList
          data={images}
          renderItem={renderImage}
          keyExtractor={(item) => item?.id}
          numColumns={columnCount}
          initialNumToRender={100000} 
          windowSize={5} 
          getItemLayout={(data, index) => ({
            length: imageSize + 10,
            offset: (imageSize + 10) * index,
            index,
          })}
        />
      </View>}

      {/* Modal for zoomable images */}
      {modalVisible && (
        <Modal visible={modalVisible} transparent={true}>
          <ImageViewer
            imageUrls={images.map((img) => ({ url: img.uri }))}
            index={selectedImageIndex}
            enableSwipeDown
            onSwipeDown={() => setModalVisible(false)}
            onCancel={() => setModalVisible(false)}
          />
        </Modal>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 5,
  },
  image: {
    margin: 5,
    borderRadius: 10,
  },
});

export default AlbumImage;

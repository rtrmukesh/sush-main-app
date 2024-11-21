import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import Layout from '../../../MyComponents/Layout';
import ImageViewer from 'react-native-image-zoom-viewer';
import debounce from 'lodash.debounce';
import { useNavigation } from '@react-navigation/native';


const AlbumImage = (props) => {
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Get screen width
  const screenWidth = Dimensions.get('window').width;
  const columnCount = 3; // Number of columns in the grid
  const imageSize = screenWidth / columnCount - 10; // Adjusting for padding/margin

  let navigation =  useNavigation()

  useEffect(() => {
    fetchAllImages(props.route.params.albumId);
  }, [props?.route?.params?.albumId]);

  const onMoveDebounced = useRef(
    debounce((position) => {
      console.log('Position updated:', position);
    }, 100)
  ).current;

  useEffect(() => {
    return () => {
      onMoveDebounced.cancel(); // Cleanup debounce on component unmount
    };
  }, [onMoveDebounced]);

  const fetchAllImages = async (albumId) => {
    try {
      let allAssets = [];
      let hasNextPage = true;
      let after = null;

      while (hasNextPage) {
        const response = await MediaLibrary.getAssetsAsync({
          album: albumId,
          mediaType: ['photo', 'video'], // Fetch both photos and videos
          after: after, // Fetch the next set of assets
        });

        allAssets = [...allAssets, ...response.assets];
        hasNextPage = response?.hasNextPage || false;
        after = response?.endCursor || null;
      }

      setImages(allAssets);
    } catch (error) {
      console.error('Error fetching assets for the album:', error);
      Alert.alert('Error', 'Failed to load images for the selected album.');
    }
  };

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  return (
    <Layout HeaderLabel={'My Gallery'} onBackPress={()=>{
      navigation.navigate("Gallery")
    }}>
      <View style={styles.container}>
        <FlatList
          data={images}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => openImageModal(index)}>
              <Image source={{ uri: item?.uri }} style={[styles.image, { width: imageSize, height: imageSize }]} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item?.id}
          numColumns={columnCount}
        />
      </View>

      {/* Modal for zoomable images */}
      {modalVisible && (
        <Modal visible={modalVisible} transparent={true}>
        <ImageViewer
          imageUrls={images.map((img) => ({ url: img.uri }))}
          index={selectedImageIndex}
          enableSwipeDown
          onSwipeDown={() => setModalVisible(false)}
          onCancel={() => setModalVisible(false)}
          enablePreload={true} // Preload images for smooth transitions
          swipeDownThreshold={50} // Fine-tune swipe gesture sensitivity
          renderIndicator={() => null} // Disable indicator to reduce rendering overhead
          loadingRender={() => null} // Avoid rendering heavy loaders
          maxOverflow={300} // Allow smoother swipe gestures
          pageAnimateTime={150} // Adjust animation timing for smoother transitions
          onMove={(position) => {
            onMoveDebounced(position); // Use debounced function for onMove
          }}
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

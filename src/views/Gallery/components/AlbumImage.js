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
  }, [props?.route?.params?.albumId, props?.route?.params?.date]);
  const fetchImages = async (albumId) => {
    if (loading) return;
    setLoading(true);

    try {
      const batchSize = 50;
      let allAssets = [];
      let hasNextPage = true;
      let nextPage = null;

      while (hasNextPage) {
        const response = await MediaLibrary.getAssetsAsync({
          ...(albumId ? { album: albumId } : {}),
          mediaType: ['photo', 'video'],
          first: batchSize,
          after: nextPage,
        });

        allAssets = allAssets.concat(response.assets);

        nextPage = response.endCursor;
        hasNextPage = response.hasNextPage;
      }

      let filteredAssets = allAssets;

      if (props?.route?.params?.date) {
        const targetDate = props?.route?.params?.date;
        filteredAssets = filteredAssets.filter((asset) => {
          const assetDate = new Date(asset.creationTime).toISOString().split("T")[0];
          return assetDate === targetDate;
        });
      }

      filteredAssets.sort((a, b) => b.modificationTime - a.modificationTime);

      setImages(filteredAssets);
    } catch (error) {
      console.error('Error fetching assets:', error);
      Alert.alert('Error', 'Failed to load images.');
    }

    setLoading(false);
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
          nestedScrollEnabled={true}
          contentContainerStyle={{ padding: 5 }}
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

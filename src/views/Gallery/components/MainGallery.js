import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import ListCustomLoader from "../../../components/ListCustomLoader";
import DeleteConfirmationModal from "../../../components/Modal/DeleteConfirmationModal";

const MainGallery = () => {
  const [albums, setAlbums] = useState([]);
  const [numColumns, setNumColumns] = useState(3);
  const [key, setKey] = useState("numColumns-3");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const { width } = useWindowDimensions();

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        fetchAlbums();
      } else {
        Alert.alert("Permission Denied", "Gallery access is required.");
      }
    };

    const updateNumColumns = () => {
      const columns = width < 400 ? 2 : width < 800 ? 3 : 4;
      setNumColumns(columns);
      setKey(`numColumns-${columns}`);
    };

    requestPermission();
    updateNumColumns();
  }, [width]);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
  
      const albumsData = await MediaLibrary.getAlbumsAsync();
  
      const mostRecentAssetResponse = await MediaLibrary.getAssetsAsync({
        mediaType: ["photo", "video"],
        first: 1, 
        sortBy: [MediaLibrary.SortBy.modificationTime], 
      });
  
      const mostRecentAsset = mostRecentAssetResponse.assets[0];
  
      const [photosData, videosData] = await Promise.all([
        MediaLibrary.getAssetsAsync({ mediaType: "photo" }),
        MediaLibrary.getAssetsAsync({ mediaType: "video" }),
      ]);
  
      const allFilesAlbum = {
        id: "all-files",
        title: "All Files",
        cover: mostRecentAsset?.uri || "https://via.placeholder.com/150", 
        totalImages: photosData.totalCount,
        totalVideos: videosData.totalCount,
      };
  
      const updatedAlbums = await Promise.all(
        albumsData.map(async (album) => {
          const [imagesResponse, videosResponse] = await Promise.all([
            MediaLibrary.getAssetsAsync({
              album: album.id,
              mediaType: "photo",
              first: 1, 
              sortBy: [MediaLibrary.SortBy.modificationTime],
            }),
            MediaLibrary.getAssetsAsync({
              album: album.id,
              mediaType: "video",
              first: 1, 
              sortBy: [MediaLibrary.SortBy.modificationTime], 
            }),
          ]);
  
          const mostRecentInAlbum = [
            ...imagesResponse.assets,
            ...videosResponse.assets,
          ].sort((a, b) => b.modificationTime - a.modificationTime);
  
          return {
            ...album,
            cover: mostRecentInAlbum[0]?.uri || null, 
            totalImages: imagesResponse.totalCount,
            totalVideos: videosResponse.totalCount,
          };
        })
      );
  
      setAlbums([allFilesAlbum, ...updatedAlbums]);
    } catch (error) {
      console.error("Error fetching albums:", error);
      Alert.alert("Error", "Failed to load albums. Please try again.");
    }
    setLoading(false);
  };

  const deleteAlbum = async (albumId) => {
    try {
      const result = await MediaLibrary.deleteAlbumsAsync([albumId], true);
      if (result) {
        fetchAlbums();
        setModalVisible(false);
      } else {
        Alert.alert("Error", "Failed to delete the album.");
      }
    } catch (error) {
      console.error("Error deleting album:", error);
      Alert.alert(
        "Error",
        "Failed to delete the album. It might be a system album."
      );
    }
  };

  const confirmDelete = (album) => {
    setSelectedAlbum(album);
    setModalVisible(true);
  };

  const renderAlbum = useCallback(
    ({ item }) => (
      <View style={styles.album}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AlbumImage", {
              ...(item.id == "all-files" ? {} : { albumId: item.id }),
              albumName: item.title,
            })
          }
        >
          <FastImage
            source={{
              uri: item.cover || "https://via.placeholder.com/150",
              priority: FastImage.priority.high,
            }}
            style={styles.albumImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <Text style={styles.albumTitle}>{item.title}</Text>
        <Text style={styles.totalMediaCount}>
          📸 {item.totalImages} | 🎥 {item.totalVideos}
        </Text>
        <TouchableOpacity
          style={styles.menuIcon}
          onPress={() => confirmDelete(item)}
        >
          <MaterialIcons name="more-vert" size={24} color="black" />
        </TouchableOpacity>
      </View>
    ),
    [navigation]
  );

  return (
    <>
      <View style={styles.container}>
        {loading ? (
          <ListCustomLoader />
        ) : (
          <FlatList
            data={albums}
            renderItem={renderAlbum}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            key={key}
            initialNumToRender={6}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        )}
      </View>

      {selectedAlbum && (
        <DeleteConfirmationModal
          modalVisible={isModalVisible}
          toggle={() => setModalVisible(false)}
          updateAction={() => deleteAlbum(selectedAlbum.id)}
          id={selectedAlbum.title}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  totalMediaCount: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    marginTop: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 10,
  },
  album: {
    flex: 1,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: "relative",
  },
  albumImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  albumTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  totalMediaCount: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    marginTop: 5,
  },
  menuIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "#6c757d",
  },
});

export default MainGallery;

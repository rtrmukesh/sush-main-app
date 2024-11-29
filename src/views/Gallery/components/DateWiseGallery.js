import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    PermissionsAndroid,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import FastImage from "react-native-fast-image";
import RNFS from "react-native-fs"; // For file system operations
import MediaService from "../../../../services/MediaService";
import ListCustomLoader from "../../../components/ListCustomLoader";
import DeleteConfirmationModal from "../../../components/Modal/DeleteConfirmationModal";
import ArrayList from "../../../lib/ArrayList";

const DateWiseGallery = () => {
    const [albums, setAlbums] = useState([]);
    const [numColumns, setNumColumns] = useState(3);
    const [key, setKey] = useState("numColumns-3");
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isDownloadIconVisible, setDownloadIconVisible] = useState(false);  // To control the visibility of the download icon
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
            const assets = await MediaLibrary.getAssetsAsync({
                mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
                first: 100000,
                sortBy: [MediaLibrary.SortBy.creationTime],
            });

            const groupedData = groupFileCountsByDate(assets.assets);

            setAlbums(groupedData);
        } catch (error) {
            console.error("Error fetching files:", error);
            Alert.alert("Error", "Failed to load files. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const groupFileCountsByDate = (files) => {
        const grouped = {};

        files.forEach((file) => {
            const date = file.creationTime
                ? new Date(file.creationTime).toISOString().split("T")[0]
                : "No Date";

            if (!grouped[date]) {
                grouped[date] = {
                    date: date,
                    videoCount: 0,
                    imageCount: 0,
                    cover: null,
                    latestCreationTime: 0,
                };
            }

            if (file.mediaType === "photo") {
                grouped[date].imageCount += 1;
            } else if (file.mediaType === "video") {
                grouped[date].videoCount += 1;
            }

            if (!file.creationTime || file.creationTime > grouped[date].latestCreationTime) {
                grouped[date].latestCreationTime = file.creationTime || Date.now();
                grouped[date].cover = file.uri;
            }
        });

        return Object.values(grouped)
            .map(({ latestCreationTime, ...rest }) => rest)
            .sort((a, b) => {
                if (a.date === "No Date") return 1;
                if (b.date === "No Date") return -1;
                return new Date(b.date) - new Date(a.date);
            });
    };

    const toggleFileSelection = (fileDate) => {
        setSelectedFiles((prevSelected) => {
            const newSelected = prevSelected.includes(fileDate)
                ? prevSelected.filter((date) => date !== fileDate)
                : [...prevSelected, fileDate];

            // Toggle the visibility of the download icon when at least one file is selected
            setDownloadIconVisible(newSelected.length > 0);

            return newSelected;
        });
    };

    const downloadSelectedFolders = async () => {
        if (selectedFiles.length === 0) {
            Alert.alert("No selection", "Please select some folders to download.");
            return;
        }

        for (const selectedDate of selectedFiles) {
            let assets = await MediaService.getFilesByDate(selectedDate);

            if (ArrayList.isArray(assets)) {
                await downloadFiles(assets, selectedDate)
            }

        }
        setSelectedFiles([]);  
        setDownloadIconVisible(false);  
    };

    const requestPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ]);
            if (granted['android.permission.READ_EXTERNAL_STORAGE'] !== 'granted' ||
                granted['android.permission.WRITE_EXTERNAL_STORAGE'] !== 'granted') {
                throw new Error("Permissions denied");
            }
        } catch (err) {
            Alert.alert("Permission Denied", "Storage permissions are required.");
            console.error(err);
        }
    };

    const downloadFiles = async (files, folderName) => {
        try {
            await requestPermissions();

            const downloadFolder = `/storage/emulated/0/DateWiseFiles/${folderName}`;
            console.log("Download Folder Path:", downloadFolder);

            const folderExists = await RNFS.exists(downloadFolder);
            if (!folderExists) {
                await RNFS.mkdir(downloadFolder);
                console.log("Folder created:", downloadFolder);
            }

            const downloadPromises = files.map(async (file) => {
                const filePath = `${downloadFolder}/${file.filename}`;
                const fileUri = file.uri;

                const fileExists = await RNFS.exists(fileUri);
                if (!fileExists) {
                    console.error(`File does not exist: ${fileUri}`);
                    return;
                }

                await RNFS.copyFile(fileUri, filePath);
                console.log(`Downloaded file: ${file.filename} to ${filePath}`);
            });

            await Promise.all(downloadPromises);
            Alert.alert(`${folderName}-All Files Downloaded`);
        } catch (error) {
            console.error("Error downloading files:", error);
            Alert.alert("Error", "Failed to download files.");
        }
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
            Alert.alert("Error", "Failed to delete the album. It might be a system album.");
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
                    onPress={() => navigation.navigate("AlbumImage", { albumId: item.id, date: item.date, albumName: item.date || item.title })}
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
                <Text style={styles.albumTitle}>{item.date || item.title}</Text>
                <Text style={styles.totalMediaCount}>
                    📸 {item.imageCount} | 🎥 {item.videoCount}
                </Text>

                <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => toggleFileSelection(item.date)}
                >
                    <MaterialIcons
                        name={selectedFiles.includes(item.date) ? "check-box" : "check-box-outline-blank"}
                        size={24}
                        color="black"
                    />
                </TouchableOpacity>
            </View>
        ),
        [selectedFiles]
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
                        keyExtractor={(item) => item.date}
                        key={key}
                        numColumns={numColumns}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        initialNumToRender={10}
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

            {/* Download Button Popup - This is outside of the FlatList */}
            {isDownloadIconVisible && (
                <TouchableOpacity onPress={downloadSelectedFolders} style={styles.downloadIconContainer}>
                    <MaterialIcons
                        name="file-download"
                        size={30}
                        color="white"
                    />
                </TouchableOpacity>
            )}
        </>
    );
};

const styles = StyleSheet.create({
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
    selectButton: {
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',  
        borderRadius: 20,  
        padding: 8, 
        elevation: 5,  
        zIndex: 1, 
    },
    downloadIconContainer: {
        position: "absolute",
        top: 20,
        right: 20,
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 50,
        zIndex: 2000,
    },
});

export default DateWiseGallery;

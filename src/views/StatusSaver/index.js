import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Modal,
    Platform,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native';
import ManageExternalStorage from 'react-native-external-storage-permission';
import RNFS from 'react-native-fs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import Video from 'react-native-video';
import Media from '../../lib/Media';


const StatusSaver = () => {
    const [statusList, setStatusList] = useState([]);
    const [downloadedFiles, setDownloadedFiles] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null); // Holds the selected media (image or video)

    const checkPathExists = async (path) => {
        try {
            const exists = await RNFS.exists(path);
            return exists;
        } catch (error) {
            console.warn(`Error checking path: ${path}`, error.message);
            return false;
        }
    };

    const getStatuses = async () => {
        setRefresh(true);

        const hasPermission = await ManageExternalStorage.checkAndGrantPermission();

        if (!hasPermission) {
            console.warn('Permission denied!');
            setRefresh(false);
            return;
        }

        const statusPaths = [
            `${RNFS.ExternalStorageDirectoryPath}/Android/media/com.whatsapp/WhatsApp/Media/.Statuses/`, // Newer path
            `${RNFS.ExternalStorageDirectoryPath}/WhatsApp/Media/.Statuses/`, // Older path (for legacy versions)
        ];

        const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mkv', 'avi', 'mov'];

        for (const path of statusPaths) {
            const exists = await checkPathExists(path);

            if (exists) {
                try {
                    const files = await RNFS.readDir(path);

                    const filteredFiles = files.filter((file) => {
                        const ext = file.name.split('.').pop().toLowerCase();
                        return validExtensions.includes(ext);
                    });

                    if (filteredFiles.length > 0) {
                        setStatusList(filteredFiles.sort((a, b) => (a.mtime < b.mtime ? 1 : -1)));
                        break; 
                    }
                } catch (error) {
                    console.warn(`Error reading directory at ${path}:`, error.message);
                }
            } else {
                console.warn(`Path does not exist: ${path}`);
            }
        }

        getDownloadedFiles();
        setRefresh(false);
    };

    const getDownloadedFiles = async () => {
        const downloadPath = `${RNFS.ExternalStorageDirectoryPath}/Download/`;
        const exists = await RNFS.exists(downloadPath);

        if (exists) {
            const files = await RNFS.readDir(downloadPath);
            setDownloadedFiles(files.map((file) => file.name));
        }
    };

    const downloadStatus = async (path, name) => {
        try {
            const downloadDest = `${RNFS.ExternalStorageDirectoryPath}/Download/${name}`;

            const dirExists = await RNFS.exists(RNFS.ExternalStorageDirectoryPath + '/Download');
            if (!dirExists) {
                await RNFS.mkdir(RNFS.ExternalStorageDirectoryPath + '/Download');
            }

            await RNFS.copyFile(path, downloadDest);

            if (Platform.OS === 'android' && Platform.Version >= 29) {
                await MediaLibrary.createAssetAsync(downloadDest);
            }

            ToastAndroid.show('Download successful!', ToastAndroid.SHORT);
            getDownloadedFiles(); 
        } catch (error) {
            console.error('Download failed:', error);
            ToastAndroid.show('Download failed', ToastAndroid.SHORT);
        }
    };

    const openPreview = (media) => {
        setSelectedMedia(media);
        setModalVisible(true);
    };

    const closePreview = () => {
        setModalVisible(false);
        setSelectedMedia(null);
    };

    useEffect(() => {
        getStatuses();
    }, []);

    return (
        <LinearGradient
            colors={['#6A11CB', '#2575FC']}
            style={{ flex: 1 }}
        >
            <View style={{ flex: 1, padding: 15 }}>
                <TouchableOpacity
                    onPress={getStatuses}
                    style={{
                        backgroundColor: '#FF6A3D',
                        paddingVertical: 12,
                        borderRadius: 25,
                        alignItems: 'center',
                        marginBottom: 15,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 5,
                    }}
                >
                    <Text style={{ color: '#fff', fontWeight: '600' }}>Refresh</Text>
                </TouchableOpacity>
                {refresh ? (
                    <Text style={{ textAlign: 'center', color: '#fff' }}>Loading...</Text>
                ) : statusList.length > 0 ? (
                    <FlatList
                        data={statusList}
                        keyExtractor={(item) => item.path}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: 15,
                                    marginVertical: 10,
                                    padding: 10,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 5,
                                    elevation: 5,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    {Media.isImage(item.name) ? (
                                        <TouchableOpacity onPress={() => openPreview(item)}>
                                            <Image
                                                source={{ uri: `file://${item.path}` }}
                                                style={{
                                                    width: 100,
                                                    height: 100,
                                                    borderRadius: 10,
                                                    marginRight: 10,
                                                }}
                                                resizeMode="cover"
                                            />
                                        </TouchableOpacity>
                                    ) : Media.isVideo(item.name) ? (
                                        <TouchableOpacity onPress={() => openPreview(item)}>
                                            <View style={{ position: 'relative' }}>
                                                <Video
                                                    source={{ uri: `file://${item.path}` }}
                                                    style={{
                                                        width: 100,
                                                        height: 100,
                                                        borderRadius: 10,
                                                    }}
                                                    resizeMode="cover"
                                                    muted={true}
                                                    repeat={true}
                                                />
                                                <MaterialCommunityIcons
                                                    name="play-circle-outline"
                                                    size={35}
                                                    color="#fff"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '30%',
                                                        left: '30%',
                                                    }}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    ) : (
                                        <Text style={{ color: '#636363' }}>Unknown Media</Text>
                                    )}
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            fontSize: 16,
                                            fontWeight: '500',
                                            color: '#333',
                                            marginBottom: 5,
                                        }}
                                    >
                                        {item.name}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableOpacity
                                            onPress={() => downloadStatus(item.path, item.name)}
                                            style={{
                                                backgroundColor: '#2575FC',
                                                paddingVertical: 5,
                                                paddingHorizontal: 20,
                                                borderRadius: 10,
                                                alignItems: 'center',
                                                alignSelf: 'flex-start',
                                                marginRight: 10,
                                            }}
                                            disabled={downloadedFiles.includes(item.name)}
                                        >
                                            <Text style={{ color: '#fff', fontWeight: '600' }}>
                                                {downloadedFiles.includes(item.name)
                                                    ? 'Downloaded'
                                                    : 'Download'}
                                            </Text>
                                        </TouchableOpacity>
                                        {downloadedFiles.includes(item.name) && (
                                            <MaterialCommunityIcons
                                                name="check-circle"
                                                size={24}
                                                color="green"
                                            />
                                        )}
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                ) : (
                    <Text
                        style={{
                            textAlign: 'center',
                            color: '#fff',
                            marginTop: 20,
                            fontSize: 16,
                        }}
                    >
                        No statuses found.
                    </Text>
                )}
            </View>

            {/* Modal for full-screen preview */}
            <Modal
                visible={modalVisible}
                onRequestClose={closePreview}
                transparent={true}
                animationType="fade"
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                }}>
                    {/* Close Icon */}
                    <TouchableOpacity onPress={closePreview} style={{
                        position: 'absolute', top: 30, right: 30, zIndex: 10
                    }}>
                        <MaterialCommunityIcons name="close" size={30} color="#fff" />
                    </TouchableOpacity>

                    {selectedMedia && Media.isImage(selectedMedia.name) ? (
                        <Image
                            source={{ uri: `file://${selectedMedia.path}` }}
                            style={{
                                width: Dimensions.get('window').width,
                                height: Dimensions.get('window').height,
                                resizeMode: 'contain',
                            }}
                        />
                    ) : selectedMedia && Media.isVideo(selectedMedia.name) ? (
                        <Video
                            source={{ uri: `file://${selectedMedia.path}` }}
                            style={{
                                width: Dimensions.get('window').width,
                                height: Dimensions.get('window').height,
                            }}
                            resizeMode="contain"
                            controls
                        />
                    ) : null}
                </View>
            </Modal>
        </LinearGradient>
    );
};

export default StatusSaver;

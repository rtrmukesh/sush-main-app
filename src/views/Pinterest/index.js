import { Ionicons } from "@expo/vector-icons";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import axios from "axios";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import Video from "react-native-video";
import RNFetchBlob from "rn-fetch-blob";
import Layout from "../../MyComponents/Layout";
const { height } = Dimensions.get('window');



const PinterestDownloader = () => {
    const [url, setUrl] = useState("");
    const [mediaUrl, setMediaUrl] = useState("");
    const [fileType, setFileType] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const clearInput = () => {
        setUrl("");
        setMediaUrl("");
        setFileType("")
    };


    const fetchMedia = async (isUrl = false) => {
        setIsLoading(true)

        try {
            const response = await axios.get(isUrl ? isUrl : url, { maxRedirects: 5 });
            let fullUrl = response.request.responseURL;
            console.log("Resolved Full URL:", fullUrl);

            const match = fullUrl.match(/(https:\/\/www\.pinterest\.com\/pin\/\d+)/);
            if (match) {
                fullUrl = match[1];
            } else {
                Alert.alert("Error", "Invalid Pinterest URL.");
                return;
            }

            const pageResponse = await axios.get(fullUrl);
            const html = pageResponse.data;

            const jsonMatch = html.match(/"videoList720P":\s*{\s*"v720P":\s*{\s*"thumbnail":\s*".*?",\s*"url":\s*"(.*?)"/);

            let mediaUrl = null;
            let fileType = null;

            if (jsonMatch && jsonMatch[1]) {
                mediaUrl = jsonMatch[1].trim();
                fileType = "video";
            }

            if (!mediaUrl) {
                const imageMatch = html.match(/"url":"(https:\/\/i\.pinimg\.com\/originals\/[^"]+)"/);
                if (imageMatch && imageMatch[1]) {
                    mediaUrl = imageMatch[1].replace(/\\u0026/g, "&");
                    fileType = "image";
                }
            }

            console.log("Extracted Media URL:", mediaUrl);

            if (mediaUrl) {
                setMediaUrl(mediaUrl);
                setFileType(fileType);
                setIsLoading(false)
            } else {
                Alert.alert("Error", "No media found.");
                setIsLoading(false)
            }
        } catch (error) {
            console.error("Error fetching media:", error);
            Alert.alert("Error", "Failed to fetch media.");
            setIsLoading(false)
        }
    };

    const pasteClipboardUrl = async () => {
        const clipboardContent = await Clipboard.getStringAsync();
        if (clipboardContent) {
            setUrl(clipboardContent);
            fetchMedia(clipboardContent);
        }
    };

    const requestStoragePermission = async () => {
        let permission =
            Platform.OS === "android"
                ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
                : PERMISSIONS.IOS.PHOTO_LIBRARY;

        const result = await check(permission);
        if (result === RESULTS.GRANTED) {
            return true;
        }

        const requestResult = await request(permission);
        return requestResult === RESULTS.GRANTED;
    };

    const downloadMedia = async () => {
        if (!mediaUrl) {
            Alert.alert("Error", "No media found to download.");
            return;
        }

        let fileExt = fileType === "video" ? "mp4" : "jpg";
        let fileName = `pinterest_${Date.now()}.${fileExt}`;
        let filePath = `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`;

        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
            Alert.alert("Permission Denied", "Storage permission is required.");
            return;
        }

        RNFetchBlob.config({ fileCache: true, appendExt: fileExt, path: filePath })
            .fetch("GET", mediaUrl)
            .then((res) => {
                CameraRoll.save(res.path(), { type: fileExt === "mp4" ? "video" : "photo" })
                    .then(() => Alert.alert("Success", "Media downloaded successfully!"))
                    .catch(() => Alert.alert("Error", "Failed to save media"));
            })
            .catch(() => {
                Alert.alert("Download Failed", "Error saving the file.");
            });
    };


    return (
        <Layout
            HeaderLabel={"Pinterest Download"}
            showBackButton={false}
            showFooter={false}
        >
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Paste Pinterest URL"
                        value={url}
                        onChangeText={setUrl}
                        style={styles.input}
                    />
                    {url.length > 0 ? (
                        <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
                            <Ionicons name="close-circle" size={24} color="gray" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={pasteClipboardUrl} style={styles.pasteButton}>
                            <Ionicons name="clipboard" size={24} color="gray" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity style={styles.fetchButton} onPress={() => fetchMedia()}>
                    <Text style={styles.fetchButtonText}>Refresh</Text>
                </TouchableOpacity>

                {isLoading ? (
                    <ActivityIndicator size="large" color="#6200ee" style={{flex:1}} />
                ) : (
                    mediaUrl && (
                        <>
                            {fileType === "image" ? (
                                <Image source={{ uri: mediaUrl }} style={styles.mediaPreview} />
                            ) : (
                                <Video
                                    key={mediaUrl}
                                    source={{ uri: mediaUrl }}
                                    style={styles.mediaPreview}
                                    controls
                                    resizeMode="contain"
                                    paused={false}  // ✅ Auto Play
                                    repeat={true}   // ✅ Loop the video
                                    muted={false}
                                    onError={(e) => console.log("Video Error:", e)}
                                />
                            )}
                            <TouchableOpacity style={styles.fetchButton} onPress={downloadMedia}>
                                <Text style={styles.fetchButtonText}>Download</Text>
                            </TouchableOpacity>
                        </>
                    )
                )}
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff", height: height * 0.9 },
    inputContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 10 },
    input: { flex: 1, paddingVertical: 10, fontSize: 16 },
    clearButton: { padding: 8 },
    pasteButton: { padding: 8 },
    fetchButton: { marginTop: 20, paddingVertical: 12, backgroundColor: "#6200ee", borderRadius: 8, alignItems: "center" },
    fetchButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    mediaPreview: { width: "100%", height: 300, marginTop: 10, borderRadius: 10 },
});

export default PinterestDownloader;
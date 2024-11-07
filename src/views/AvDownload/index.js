import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import * as Progress from "react-native-progress";
import MediaService from "../../../services/MediaService";

const AvDownload = () => {
  const [url, setUrl] = useState("");
  const [qualities, setQualities] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const fetchQualities = async () => {
    try {
      await MediaService.getQuality(url, (res) => {
        const categorizedQualities = categorizeQualities(res?.data?.qualities);
        setQualities(categorizedQualities);
        setModalVisible(true);
      });
    } catch (error) {
      console.error("Error fetching qualities:", error);
    }
  };

  const categorizeQualities = (qualities) => {
    const videoQualities = [];
    const audioQualities = [];

    qualities.forEach((quality) => {
      if (quality.resolution) {
        videoQualities.push(quality);
      } else if (quality.bitrate) {
        audioQualities.push(quality);
      }
    });

    return [
      { title: "Video Qualities", data: videoQualities },
      { title: "Audio Qualities", data: audioQualities },
    ];
  };

  const downloadFile = async (selectedQuality) => {
    if (!selectedQuality) {
      Alert.alert("Please select a quality.");
      return;
    }
    setModalVisible(false);
    setDownloadProgress(0);

    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        selectedQuality.url,
        FileSystem.documentDirectory + "downloadedMedia.mp4",
        {},
        (downloadProgress) => {
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          setDownloadProgress(progress);
        }
      );

      const { uri } = await downloadResumable.downloadAsync();
      saveToGallery(uri);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const saveToGallery = async (fileUri) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      await MediaLibrary.saveToLibraryAsync(fileUri);
      Alert.alert("Download complete!", "Saved to gallery.");
    } else {
      Alert.alert("Permission denied", "Cannot save to gallery.");
    }
    setDownloadProgress(0);
  };

  const clearInput = () => {
    setUrl("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Paste video/audio URL"
          value={url}
          onChangeText={setUrl}
          style={styles.input}
        />
        {url.length > 0 && (
          <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
            <Ionicons name="close-circle" size={24} color="gray" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.fetchButton} onPress={fetchQualities}>
        <Text style={styles.fetchButtonText}>Get Quality</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <SectionList
              sections={qualities}
              keyExtractor={(item) => item?.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => downloadFile(item)}>
                  <Text style={styles.qualityText}>
                    {item.label} ({item.resolution ? item.resolution : "Audio"})
                  </Text>
                </TouchableOpacity>
              )}
              renderSectionHeader={({ section }) => (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeaderText}>{section.title}</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Download Progress */}
      {downloadProgress > 0 && (
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={downloadProgress}
            width={300}
            color="green"
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            {Math.floor(downloadProgress * 100)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  clearButton: {
    padding: 10,
    marginLeft: 8,
  },
  fetchButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#6200ee",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  fetchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    padding: 10,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#333",
  },
  qualityText: {
    fontSize: 16,
    textAlign: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 5,
  },
  progressContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  progressBar: {
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: "#555",
  },
});

export default AvDownload;

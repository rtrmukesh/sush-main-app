import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";
import RNFS from "react-native-fs";
import { launchImageLibrary } from "react-native-image-picker";
import Layout from "../../MyComponents/Layout";
import { MaterialIcons } from "@expo/vector-icons";
import ArrayList from "../../lib/ArrayList";
import ManageExternalStorage from 'react-native-external-storage-permission';
import Video from "react-native-video";
import Share from 'react-native-share';


const HiddenFileScreen = () => {
  const [hiddenFiles, setHiddenFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const HIDDEN_DIR = `${RNFS.ExternalStorageDirectoryPath}/.HiddenFiles/`;

  const { width } = Dimensions.get("window");
  const numColumns = 3;
  const imageWidth = width / numColumns - 2;

  useEffect(() => {
    getHiddenFiles();
  }, []);

  const getHiddenFiles = async () => {
    await ManageExternalStorage.checkAndGrantPermission();
    const files = await loadHiddenFiles();
    setHiddenFiles(files);
  };

  const getFilePath = (uri) =>
    uri.startsWith("file://") ? uri.replace("file://", "") : uri;

  const ensureHiddenDirectory = async () => {
    if (!(await RNFS.exists(HIDDEN_DIR))) {
      await RNFS.mkdir(HIDDEN_DIR);
    }
    const noMediaPath = `${HIDDEN_DIR}.nomedia`;
    if (!(await RNFS.exists(noMediaPath))) {
      await RNFS.writeFile(noMediaPath, "");
    }
  };

  const pickFiles = async () => {
    launchImageLibrary(
      {
        mediaType: "mixed",
        selectionLimit: 0,
        includeBase64: false,
      },
      async (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.error("ImagePicker Error: ", response.errorMessage);
        } else {
          const { assets } = response;
          await handlePickedFiles(assets);
        }
      }
    );
  };

  const handlePickedFiles = async (assets) => {
    if (assets && assets.length > 0) {
      setIsProcessing(true);
      try {
        const files = await mapFilesToHiddenDirectory(assets);
        if (files.length > 0) {
          await ensureHiddenDirectory();
          const movedFiles = await moveFilesToHiddenDirectory(files);
          await saveHiddenFiles(movedFiles);
          setHiddenFiles(await loadHiddenFiles());
        } else {
          Alert.alert("Error", "No valid files selected to move.");
        }
      } catch (error) {
        console.error("Error processing files:", error);
        Alert.alert("Error", "An error occurred while moving files.");
      } finally {
        setIsProcessing(false);
      }
    } else {
      Alert.alert("Error", "No files selected or action canceled.");
    }
  };

  const mapFilesToHiddenDirectory = async (assets) => {
    return Promise.all(
      assets.map(async (asset) => {
        if (!asset.uri) {
          console.error("Asset URI is missing");
          return null;
        }
        return {
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName,
          realPath: asset.originalPath,
        };
      })
    ).then((files) => files.filter((file) => file !== null));
  };

  const moveFilesToHiddenDirectory = async (files) => {
    const movedFiles = [];
    for (const file of files) {
      try {
        const fileName =
          file.fileName || file.name || file.uri.split("/").pop();
        const newPath = `${HIDDEN_DIR}${fileName}`;
        const sourcePath = getFilePath(file.uri);
        const sourceInfo = await RNFS.exists(sourcePath);
        if (sourceInfo) {
          const newPathInfo = await RNFS.exists(newPath);
          if (!newPathInfo) {
            await RNFS.copyFile(sourcePath, newPath);
            const newPathExists = await RNFS.exists(newPath);
            if (newPathExists) {
              movedFiles.push({
                uri: `file://${newPath}`,
                type: file.type,
                name: fileName,
                oldPath: file.realPath,
              });
              await RNFS.unlink(file.realPath);
            } else {
              console.error(`Failed to copy file to: ${newPath}`);
            }
          } else {
            console.log(`File already exists at ${newPath}`);
          }
        } else {
          console.error(`Source file does not exist: ${sourcePath}`);
        }
      } catch (error) {
        console.error("Error moving file:", error);
      }
    }
    return movedFiles;
  };

  const saveHiddenFiles = async (files) => {
    try {
      const existingFiles = await loadHiddenFiles();
      const uniqueFiles = files.filter(
        (file) => !existingFiles.some((existing) => existing?.uri === file?.uri)
      );
      await EncryptedStorage.setItem(
        "hiddenFiles",
        JSON.stringify([...existingFiles, ...uniqueFiles])
      );
    } catch (error) {
      console.error("Error saving hidden files:", error);
    }
  };

  const restoreHiddenFiles = async () => {
    try {
      const existingFiles = await loadHiddenFiles();
      let reStoredValues = await restoreFiles();
      const filteredFiles = existingFiles.filter(
        (file) => !reStoredValues.some((existing) => existing.uri === file.uri)
      );
      await EncryptedStorage.setItem(
        "hiddenFiles",
        JSON.stringify([...filteredFiles])
      );
      setSelectedFiles([]);
      setHiddenFiles(await loadHiddenFiles());
    } catch (error) {
      console.error("Error saving hidden files:", error);
    }
  };

  const loadHiddenFiles = async () => {
    try {
      const storedFiles = await EncryptedStorage.getItem("hiddenFiles");
      return storedFiles ? JSON.parse(storedFiles) : [];
    } catch (error) {
      console.error("Error loading hidden files:", error);
      return [];
    }
  };

  const toggleFileSelection = (file) => {
    setSelectedFiles((prev) =>
      prev.includes(file)
        ? prev.filter((item) => item !== file)
        : [...prev, file]
    );
  };

  const restoreFiles = async () => {
    let reStoredFiles = [];
    if (ArrayList.isArray(selectedFiles)) {
      for (let r = 0; r < selectedFiles.length; r++) {
        const { oldPath, uri, name } = selectedFiles[r];

        const sourcePath = getFilePath(uri);
        const isOldPath = await RNFS.exists(oldPath);
        if (!isOldPath) {
          await RNFS.copyFile(sourcePath, oldPath);
          const oldPathRestored = await RNFS.exists(oldPath);
          if (oldPathRestored) {
            reStoredFiles.push(selectedFiles[r]);
            RNFS.scanFile(oldPath);
            await RNFS.unlink(sourcePath);
          }
        }
      }
    }
    return reStoredFiles;
  };

 
  const shareFiles = async () => {
    try {
      const filePaths = await Promise.all(
        selectedFiles.map(async (file) => {
          const filePath = file.uri.replace('file://', '');
          const fileExists = await RNFS.exists(filePath);
          if (fileExists) {
            return { path: filePath, type: file.type }; // Include type with file path
          } else {
            console.warn(`File not found: ${file.name}`);
            return null;
          }
        })
      );

      const validFiles = filePaths.filter((file) => file !== null);

      if (validFiles.length === 0) {
        Alert.alert('No valid files available to share.');
        return;
      }

      // Separate images and videos
      const images = validFiles.filter((file) => file.type.startsWith('image'));
      const videos = validFiles.filter((file) => file.type.startsWith('video'));

      const imagePaths = images.map((file) => `file://${file.path}`);
      const videoPaths = videos.map((file) => `file://${file.path}`);

      // Combine both image and video paths for mixed content
      const combinedPaths = [...videoPaths,...imagePaths];

      if (combinedPaths.length > 0) {
        const options = {
          urls: combinedPaths, 
        };

        // Share the files using react-native-share
        await Share.open(options).then((res) => {
          if (res.success) {
            Alert.alert('Files Shared Successfully');
          }
        }).catch((err) => {
          console.error('Sharing failed', err);
          Alert.alert('Files Sharing Failed');
        });
      } else {
        Alert.alert('No images or videos available to share.');
      }
    } catch (error) {
      console.error('Error sharing files:', error);
      Alert.alert('Error', 'Failed to share files.');
    }
  };

  const renderFile = ({ item }) => {
    const isImage =
      item.type?.startsWith("image") ||
      /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(item.uri);
    const isVideo =
      item.type?.startsWith("video") ||
      /\.(mp4|mkv|mov|avi|webm|flv|wmv|3gp)$/i.test(item.uri);

    return (
      <TouchableOpacity
        style={[styles.fileContainer, { width: imageWidth }]}
        onPress={() => ArrayList.isArray(selectedFiles) && toggleFileSelection(item)}
        onLongPress={() => toggleFileSelection(item)}
      >
        <View style={styles.imageContainer}>
          {ArrayList.isArray(selectedFiles) && (
            <MaterialIcons
              name={
                selectedFiles.includes(item)
                  ? "check-box"
                  : "check-box-outline-blank"
              }
              size={24}
              color="black"
              style={styles.checkBoxIcon}
              onPress={() => toggleFileSelection(item)}
            />
          )}
          {isImage ? (
            <Image
              source={{ uri: item.uri }}
              style={[styles.image, { width: imageWidth, height: imageWidth }]}
            />
          ) : isVideo ? (
            <Video
              source={{ uri: `file://${item.uri}` }}
              style={[styles.image, { width: imageWidth, height: imageWidth }]}
              resizeMode="cover"
              muted={true}
              repeat={true}
            />
          ) : (
            <Text style={styles.text}>Unsupported File: {item.name}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  let actionMenu = [];
  if (ArrayList.isArray(selectedFiles)) {
    actionMenu.push({
      onPress: () => {
        restoreHiddenFiles();
      },
      icon: "restore",
      label: "Restore"
    },
      {
        onPress: () => {
          shareFiles();
        },
        icon: "share",
        label: "Share"
      }
    );
  } else {
    actionMenu.push({
      onPress: () => {
        pickFiles();
      },
      icon: "plus",
      label: "Add"
    })
  }

  return (
    <Layout HeaderLabel="Hidden Files" showHeader actionMenu={actionMenu}>
      <View style={styles.container}>
        {isProcessing && (
          <ActivityIndicator
            size="large"
            color="#3498db"
            style={styles.activityIndicator}
          />
        )}
        <FlatList
          data={hiddenFiles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderFile}
          numColumns={numColumns}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#2c3e50",
    marginVertical: 20,
  },
  fileContainer: {
    alignItems: "center",
    borderBottomColor: "#ddd",
    margin: 1,
    backgroundColor: "white",
  },
  image: {
    resizeMode: "cover",
    borderColor: "white",
    borderWidth: 2,
  },
  text: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
  },
  selectButton: {
    flexDirection: "row",
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  imageContainer: {
    position: "relative",
  },
  checkBoxIcon: {
    top: 5,
    left: 5,
    marginBottom: 5,
  },
  selectButtonText: {
    fontSize: 18,
    color: "#fff",
    marginLeft: 10,
  },
  clearButton: {
    flexDirection: "row",
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  clearButtonText: {
    fontSize: 18,
    color: "#fff",
    marginLeft: 10,
  },
  activityIndicator: {
    marginVertical: 20,
  },
});

export default HiddenFileScreen;
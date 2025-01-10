import { Ionicons } from '@expo/vector-icons'; // Install this via `expo install @expo/vector-icons`
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import RNFS from 'react-native-fs';

const HIDDEN_DIR = `${RNFS.ExternalStorageDirectoryPath}/.HiddenFiles/`;

const FolderList = ({ showFolderList, arrayList, onClick, onClose }) => {
    const [folders, setFolders] = useState([]);

    // Fetch folders from the directory
    const fetchFolders = async () => {
        try {
            const dirExists = await RNFS.exists(HIDDEN_DIR);
            if (!dirExists) {
                console.log('Hidden directory does not exist.');
                return;
            }
            const items = await RNFS.readDir(HIDDEN_DIR);
            const folderList = items.filter(item => item.isDirectory());
            setFolders(folderList);
        } catch (error) {
            console.error('Error fetching folders:', error);
        }
    };

    useEffect(() => {
        fetchFolders();
    }, [showFolderList]);

    const renderFolder = ({ item }) => (
        <TouchableOpacity
            style={styles.folderItem}
            onPress={() => {
                onClick(item);
                onClose();
            }}
        >
            <Text style={styles.folderName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <Modal visible={showFolderList} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.popupContainer}>
                    {/* Close Icon */}
                    <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>

                    <Text style={styles.title}>Select a Folder</Text>
                    <FlatList
                        data={arrayList || folders}
                        keyExtractor={item => item.path || item.id}
                        renderItem={renderFolder}
                        ListEmptyComponent={
                            <Text style={styles.emptyMessage}>No folders available.</Text>
                        }
                    />
                </View>
            </View>
        </Modal>
    );
};

export default FolderList;

// Styles
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        position: 'relative',
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    folderItem: {
        padding: 16,
        marginBottom: 5,
        backgroundColor: '#eaeaea',
        borderRadius: 5,
    },
    folderName: {
        fontSize: 18,
        color: '#333',
    },
    emptyMessage: {
        textAlign: 'center',
        color: '#888',
        marginTop: 10,
    },
});

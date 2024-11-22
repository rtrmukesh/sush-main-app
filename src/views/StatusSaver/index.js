import React, { useState, useEffect } from 'react';
import { View, Image, FlatList, TouchableOpacity, Text } from 'react-native';
import WhatsAppService from '../../../services/WhatsAppService';
import PermissionService from '../../../services/PermissionService';

const StatusSaver = () => {
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        const fetchStatuses = async () => {
            const permissionsGranted = await PermissionService.requestMediaLibraryPermissions();
            if (permissionsGranted) {
                const files = await WhatsAppService.getWhatsAppStatuses();
                setStatuses(files);
            }
        };
        fetchStatuses();
    }, []);

    const saveStatus = async (uri) => {
        const savePath = `${FileSystem.documentDirectory}SavedStatuses/`;
        await FileSystem.makeDirectoryAsync(savePath, { intermediates: true });

        const fileName = uri.split('/').pop();
        await FileSystem.copyAsync({ from: uri, to: `${savePath}${fileName}` });

        alert('Status saved successfully!');
    };
console.log('statuses>>>------------------------> ', statuses);
    return (
        <FlatList
            data={statuses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={{ margin: 10 }}>
                    {item.type === 'image' ? (
                        <Image source={{ uri: item.uri }} style={{ width: 100, height: 100 }} />
                    ) : (
                        <Text>Video: {item.uri}</Text>
                    )}
                    <TouchableOpacity onPress={() => saveStatus(item.uri)}>
                        <Text style={{ color: 'blue', marginTop: 5 }}>Save</Text>
                    </TouchableOpacity>
                </View>
            )}
        />
    );
};

export default StatusSaver;

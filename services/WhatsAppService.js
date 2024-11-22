import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

class WhatsAppService {
    static STATUS_PATHS = [
        // `${FileSystem.documentDirectory}WhatsApp/Media/.Statuses/`, // Old Path
        // `${FileSystem.documentDirectory}Android/media/com.whatsapp/WhatsApp/Media/.Statuses/`, // New Path
        "/storage/emulated/0/WhatsApp/Media/.Statuses/"
    ];

    static async requestPermissions() {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access media library is required!');
            return false;
        }
        return true;
    }

    static async getWhatsAppStatuses() {
        const hasPermission = await this.requestPermissions();
        if (!hasPermission) return [];

        for (const statusFolder of this.STATUS_PATHS) {
            try {
                const files = await FileSystem.readDirectoryAsync(statusFolder);
                if (files && files.length > 0) {
                    return files.map((file) => ({
                        uri: `${statusFolder}${file}`,
                        type: file.endsWith('.mp4') ? 'video' : 'image',
                    }));
                }
            } catch (error) {
                console.warn(`Could not access path: ${statusFolder}`);
            }
        }

        console.error('No statuses found or access denied.');
        return [];
    }
}

export default WhatsAppService;

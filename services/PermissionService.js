
import * as MediaLibrary from 'expo-media-library';
import { PermissionsAndroid, Platform, ToastAndroid } from 'react-native';


class PermissionService {

    static async requestMediaLibraryPermissions() {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need media library permissions to make this work!');
            return false;
        }
        return true;
    };

    static async getStatusPermisson() {
        if (Platform.OS === 'android' && Platform.Version >= 29) {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                ToastAndroid.show('Permission denied to access media', ToastAndroid.SHORT);
                return false;
            }
        }

        if (Platform.OS === 'android' && Platform.Version < 29) {
            const readGranted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission',
                    message: 'This app needs storage access to fetch WhatsApp statuses.',
                }
            );
            const writeGranted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission',
                    message: 'This app needs storage access to save WhatsApp statuses.',
                }
            );

            if (readGranted !== PermissionsAndroid.RESULTS.GRANTED || writeGranted !== PermissionsAndroid.RESULTS.GRANTED) {
                ToastAndroid.show('Storage permission denied', ToastAndroid.SHORT);
                return false;
            }
        }

        return true;
    }
}

export default PermissionService
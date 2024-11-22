
import * as MediaLibrary from 'expo-media-library';


class PermissionService {

    static async requestMediaLibraryPermissions() {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need media library permissions to make this work!');
            return false;
        }
        return true;
    };
}

export default PermissionService
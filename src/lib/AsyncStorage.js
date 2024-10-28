
import AsyncStorage from "@react-native-async-storage/async-storage";

const AsyncStorageObject = {

    setItem: async (name, value) => {
        if (name && value) {
            await AsyncStorage.setItem(name, value);
        }
    },

    setJSONItem: async (name, value) => {
        if (name) {
            value = JSON.stringify(value);
            if (value) {
                await AsyncStorage.setItem(name, value);
            }
        }
        return true
    },

    getJSONItem: async (name) => {
        if (name) {
            let cookieValue = await AsyncStorage.getItem(name);

            if (cookieValue) {
                cookieValue = JSON.parse(cookieValue);
            }

            return cookieValue;

        }

        return null

    },

    getItem: async (name) => {
        if (name) {
            let cookieValue = await AsyncStorage.getItem(name);
            return cookieValue;

        }
    },

    clearAll: async () => {
        AsyncStorage.clear()
            .then(() => console.log('All Data Cleared'))
            .catch((error) => console.error('Error clearing AsyncStorage', error))
    }
};

export default AsyncStorageObject;

import { endpoints } from "../src/api/endpoints";
import { apiClient } from "../src/apiClient";
import * as MediaLibrary from 'expo-media-library';


class MediaService{
    static getQuality(url, callback){
        apiClient.get(`${endpoints().MediaApi}/getQualitiy?url=${url}`).then((res)=>{
            return callback && callback(res)
        }).catch((error)=>{
            console.log(error);
            
        })
    }

    static getFilesByDate = async (date) => {
        try {
          const response = await MediaLibrary.getAssetsAsync({
            mediaType: ['photo', 'video'], 
            first: 1000000, 
          });
      
          let filteredAssets = response.assets.sort(
            (a, b) => b.creationTime - a.creationTime
          );
            filteredAssets = filteredAssets.filter((asset) => {
              const assetDate = new Date(asset.creationTime).toISOString().split("T")[0];
              return assetDate === date;
            });

            return filteredAssets
      
        } catch (error) {
          console.error('Error fetching assets:', error);
          Alert.alert('Error', 'Failed to load images.');
        }
      };
}

export default MediaService;
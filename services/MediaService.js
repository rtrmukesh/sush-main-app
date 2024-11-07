import { endpoints } from "../src/api/endpoints";
import { apiClient } from "../src/apiClient";


class MediaService{
    static getQuality(url, callback){
        apiClient.get(`${endpoints().MediaApi}/getQualitiy?url=${url}`).then((res)=>{
            return callback && callback(res)
        }).catch((error)=>{
            console.log(error);
            
        })
    }
}

export default MediaService;
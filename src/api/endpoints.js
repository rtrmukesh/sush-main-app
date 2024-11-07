import { BACKEND_API_URL } from '@env';

const appApi = (path) => `${BACKEND_API_URL}/${path}`;
// API call routes
export const endpoints = () => ({
  MediaApi: appApi("v1/media"),

});

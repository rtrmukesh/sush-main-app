import axios from "axios";
import { BACKEND_API_URL } from '@env';


export const apiClient = axios.create({
    baseURL: BACKEND_API_URL,
    timeout: 50000,
    headers: {
      "Content-Type": "application/json",
      common: {
        //set token for authorization
        // Authorization: Cookie.get(COOKIE_SESSION_TOKEN),
      },
    },
  });
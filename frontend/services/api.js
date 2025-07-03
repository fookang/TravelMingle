import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/tokens";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: Constants.expoConfig.extra.API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
   return config;
  },
  (error) => {
    return Promise.reject(error)
  }
);

export default api;

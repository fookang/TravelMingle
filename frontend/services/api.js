import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/tokens";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

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
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      try {
        originalRequest._retry = true;
        const refreshtoken = await SecureStore.getItemAsync(REFRESH_TOKEN);
        if (refreshtoken) {
          const response = await axios.post(
            `${Constants.expoConfig.extra.API_URL}/user/token/refresh/`,
            { refresh: refreshtoken }
          );

          const newAccessToken = response.data.access;

          await SecureStore.setItemAsync(ACCESS_TOKEN, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return api(originalRequest);
        }
      } catch (error) {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN);
        router.push("/login");

        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

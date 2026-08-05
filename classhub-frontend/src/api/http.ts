import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { loadingStore } from "./loadingStore";

interface LoadingRequestConfig
  extends InternalAxiosRequestConfig {
  skipGlobalLoader?: boolean;
  loaderStarted?: boolean;
}

const http = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  (config: LoadingRequestConfig) => {
    const token = localStorage.getItem(
      "classhub_token",
    );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    if (!config.skipGlobalLoader) {
      loadingStore.start();
      config.loaderStarted = true;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => {
    const config =
      response.config as LoadingRequestConfig;

    if (config.loaderStarted) {
      loadingStore.stop();
    }

    return response;
  },
  (error: AxiosError<any>) => {
    const config =
      error.config as
        | LoadingRequestConfig
        | undefined;

    if (config?.loaderStarted) {
      loadingStore.stop();
    }

    if (error.response?.status === 401) {
      console.error(
        "401 Unauthorized:",
        error.response.data,
      );
    }

    if (error.response?.status === 403) {
      console.error(
        "403 Forbidden:",
        error.response.data,
      );
    }

    return Promise.reject(error);
  },
);

export default http;
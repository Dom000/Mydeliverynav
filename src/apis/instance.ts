import { setPoorNetworkConnection } from "@/lib/network-status";
import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { BASE_URL } from "./constant";
import { clearAuthTokens, getAccessToken } from "./token-storage";

export const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers["x-access-token"] = token;
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    setPoorNetworkConnection(false);
    return response;
  },
  (error: AxiosError) => {
    const message = String(error?.message ?? "").toLowerCase();
    const isPoorConnectionError =
      !error?.response ||
      error?.code === "ECONNABORTED" ||
      message.includes("network") ||
      message.includes("timeout") ||
      message.includes("internet");

    if (isPoorConnectionError) {
      setPoorNetworkConnection(true);
    }

    if (error?.response?.status === 401) {
      clearAuthTokens();
    }

    return Promise.reject(error);
  },
);

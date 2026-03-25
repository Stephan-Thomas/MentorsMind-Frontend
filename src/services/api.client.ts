import type { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";

let accessToken: string;
let refreshToken: string;

export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
};

// Use to wait few seconds before retry
const getBackOffDelay = (retry: number) => {
  return Math.min(1000 * 2 ** retry, 10000); // capped at 10s
};
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const api: AxiosInstance = axios.create({ baseURL: "/api", timeout: 10000 });
const MAX_RETRIES = 3;

api.interceptors.request.use((config) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (err: AxiosError) => {
    const originalReq = err.config as AxiosRequestConfig & { _retry?: number };

    // Transient error retry
    if (!originalReq._retry) {
      originalReq._retry = 0;
    }

    if (
      err.response?.status &&
      err.response.status >= 500 &&
      originalReq._retry < MAX_RETRIES
    ) {
      originalReq._retry++;

      // void immediate retry
      await sleep(getBackOffDelay(originalReq._retry));

      return api(originalReq);
    }

    // Refresh token
    if (err.response?.status === 401 && refreshToken) {
      try {
        const res = await axios.post("/auth/refesh", { refreshToken });
        setTokens(res.data.accessToken, res.data.refreshToken);

        if (originalReq.headers) {
          originalReq.headers.Authorization = `Bearer ${res.data.accessToken}`;
        }

        return api(originalReq);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  },
);
export default api;

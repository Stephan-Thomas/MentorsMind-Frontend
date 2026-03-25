import type { AxiosRequestConfig } from "axios";
import api from "./api.client";
import { getCached, setCache } from "./cache";

export const request = async <T>(
  config: AxiosRequestConfig,
  useCache = false,
): Promise<T> => {
  const key = JSON.stringify(config);

  if (useCache) {
    const cached = getCached<T>(key);

    if (cached) return cached;
  }

  const ctrl = new AbortController();
  config.signal = ctrl.signal;

  const res = await api(config);

  if (useCache) {
    setCache(key, res.data);
  }

  return res.data;
};

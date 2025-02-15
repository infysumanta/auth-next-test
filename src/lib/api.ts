import axios, { AxiosError, AxiosRequestConfig } from "axios";

interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
}

interface RequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Create axios instance
const api = axios.create({
  withCredentials: true, // Required for cookies
});

export const apiServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Required for cookies
});
// Default error handler for unauthorized requests on server side
let onUnauthorized = (): never => {
  throw new Error("Authentication required");
};

// Set custom handler for unauthorized requests
export const setUnauthorizedHandler = (handler: () => never) => {
  onUnauthorized = handler;
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe failed requests to retry after token refresh
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// Process failed requests after token refresh
function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RequestConfig;

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (!isRefreshing) {
      isRefreshing = true;
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        const response = await axios.post<TokenResponse>(
          "/auth/refresh",
          {},
          {
            baseURL: process.env.NEXT_PUBLIC_API_URL,
            withCredentials: true, // This will include cookies
          },
        );

        const { accessToken } = response.data;

        // Process queued requests
        onTokenRefreshed(accessToken);

        // Reset refreshing state
        isRefreshing = false;

        // Retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh token is expired/invalid, clear all tokens and redirect to login
        isRefreshing = false;
        refreshSubscribers = [];

        // Handle client vs server side
        if (typeof window !== "undefined") {
          // Client-side: Redirect to login
          window.location.href = "/";
        } else {
          // Server-side: Throw error to be handled by the calling code
          onUnauthorized();
        }

        return Promise.reject(refreshError);
      }
    }

    // If refresh already in progress, add request to queue
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        resolve(axios(originalRequest));
      });
    });
  },
);

export default api;

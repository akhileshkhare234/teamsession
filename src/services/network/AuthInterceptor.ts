import { InternalAxiosRequestConfig } from "axios";
import authManager from "../auth/AuthManager";

export const AccessTokenInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = authManager.getToken();
  if (token !== null) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const AuthInterceptor = (error: any) => {
  const status = error.response?.status || 500;

  if (status === 401) {
    console.log("AuthInterceptor: 401 Unauthorized");
    // Clear auth data
    localStorage.removeItem("accessToken");
    authManager.clearToken();
    localStorage.clear();

    // Redirect to login page with hash routing
    window.location.href = "/#/login";
  }

  return Promise.reject(error);
};

export default AuthInterceptor;

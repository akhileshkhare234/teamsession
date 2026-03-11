import axios, { AxiosInstance } from "axios";
import { ApiError, ApiResponse } from "./ApiResponse";
import appConfig from "../config";
import { string } from "yup";
import AuthManager from "services/auth/AuthManager";
import AuthInterceptor, { AccessTokenInterceptor } from "./AuthInterceptor";
import localStorageUtil from "utility/localStorageUtil";
import { signOut } from "firebase/auth";
import { auth } from "components/firebase/firebase";

class HttpClient {
  private axiosClient: AxiosInstance;

  constructor() {
    this.axiosClient = axios.create({
      baseURL: appConfig.getBaseUrl(),
    });
    this.addAccessTokenInterceptor();
    this.addAuthInterceptor();
  }

  private addAccessTokenInterceptor() {
    this.axiosClient.interceptors.request.use(
      (config: any) => {
        return AccessTokenInterceptor(config);
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );
  }

  private addAuthInterceptor() {
    this.axiosClient.interceptors.response.use(
      (response: any) => {
        return response;
      },
      async (error: any) => {
        // Anything except 2XX goes to here
        if (error.response && error.response.status === 401) {
          // Clear all auth data
          localStorageUtil.removeItem("accessToken");
          await signOut(auth);
          AuthManager.clearToken();
          localStorage.clear();

          // Redirect to login with hash routing
          window.location.href = "/#/login";
          return Promise.reject(error);
        }
        return AuthInterceptor(error);
      }
    );
  }

  async get<T>(url: string, headers?: any): Promise<ApiResponse<T>> {
    try {
      const res = await this.axiosClient.get<T>(url, { headers: headers });
      return {
        message: string,
        value: res.data,
        success: true,
      };
    } catch (error: any) {
      return this.handleAxiosError<T>(error);
    }
  }

  async post<T>(
    url: string,
    data: any,
    headers?: any
  ): Promise<ApiResponse<T>> {
    try {
      const res = await this.axiosClient.post<T>(url, data, {
        headers: headers,
      });
      if (res.status >= 200 && res.status <= 299) {
        return {
          success: true,
          value: res.data,
          message: string,
        };
      } else {
        const data: any = res.data || {
          code: res.status,
          message: res.statusText,
        };
        return {
          success: false,
          error: data,
          message: string,
        };
      }
    } catch (error: any) {
      return this.handleAxiosError<T>(error);
    }
  }

  public async put<T>(
    url: string,
    requestData?: any,
    headers?: any
  ): Promise<ApiResponse<T>> {
    try {
      const res = await this.axiosClient.put<T>(url, requestData, {
        headers: headers,
      });
      if (res.status >= 200 && res.status <= 299) {
        return {
          success: true,
          value: res.data,
          message: string,
        };
      } else {
        const data: any = res.data || {
          code: res.status,
          message: res.statusText,
        };
        return {
          success: false,
          error: data,
          message: string,
        };
      }
    } catch (error: any) {
      return this.handleAxiosError<T>(error);
    }
  }

  public async patch<T>(
    url: string,
    data: any,
    headers?: any
  ): Promise<ApiResponse<T>> {
    try {
      const res = await this.axiosClient.patch<T>(url, data, {
        headers: headers,
      });
      if (res.status >= 200 && res.status <= 299) {
        return {
          message: string,
          success: true,
          value: res.data,
        };
      } else {
        const data: any = res.data || {
          code: res.status,
          message: res.statusText,
        };
        return {
          success: false,
          error: data,
          message: string,
        };
      }
    } catch (error: any) {
      return this.handleAxiosError<T>(error);
    }
  }

  public async delete<T>(url: string, headers?: any): Promise<ApiResponse<T>> {
    try {
      const res = await this.axiosClient.delete<T>(url, { headers: headers });
      if (res.status >= 200 && res.status <= 299) {
        return {
          success: true,
          value: res.data,
          message: string,
        };
      } else {
        const data: any = res.data || {
          code: res.status,
          message: res.statusText,
        };
        return {
          success: false,
          error: data,
          message: string,
        };
      }
    } catch (error: any) {
      return this.handleAxiosError<T>(error);
    }
  }

  private handleAxiosError<T>(error: any): ApiResponse<T> {
    const data: ApiError = { code: 1500, message: `unknow` };
    if (!error.response) {
      console.error(`http.error: CROS Error`, error.response?.data?.message);
      data.code = 1408;
      data.message = `CORS request did not succeed`;
    } else if (error.response) {
      console.error(`http.error.response:`, error.response?.data?.message);
      const res = error.response;
      if (res.data) {
        data.code = res.data.code || res.data.status;
        data.message = res.data.message || res.data.error;
      } else {
        data.code = error.response.status;
        data.message = error.response.statusText;
      }
    } else if (error.request) {
      console.error(`http.error:`, error.request);
      data.code = 1500;
      data.message = `No response from serevr`;
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`http.error:`, error.response?.data?.message);
      data.code = 1408;
      data.message = `Request Timeout`;
    }
    return { message: string, success: false, error: data };
  }
}

const httpClient = new HttpClient();
export default httpClient;

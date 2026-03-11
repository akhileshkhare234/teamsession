import { ApiResponse } from "../network/ApiResponse";
import httpClient from "../network/httpClient";
import { AuthResponse } from "./AuthResponse";

const REGISTER = "users/register";
const LOGIN = "user/login";

class AuthApi {
  public async register(data: any): Promise<ApiResponse<AuthResponse>> {
    const response = await httpClient.post<AuthResponse>(REGISTER, data);
    console.log("response = ", response);
    return response;
  }

  public async login(data: any): Promise<ApiResponse<AuthResponse>> {
    const response = await httpClient.post<AuthResponse>(LOGIN, data);
    console.log("response = ", response);
    return response;
  }
}

const authApi = new AuthApi();
export default authApi;

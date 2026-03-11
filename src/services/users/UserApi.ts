import { ApiResponse } from "../network/ApiResponse";
import httpClient from "../network/httpClient";
import {
  CreateUserRequest,
  CreateUserResponse,
  FetchAIRequest,
  FetchAIResponse,
  GetUserListResponse,
} from "./user.api.interface";

class UserApi {
  public async createUser(
    requestData: CreateUserRequest
  ): Promise<ApiResponse<CreateUserResponse>> {
    const response = await httpClient.post<CreateUserResponse>(
      "contact/create",
      requestData
    );
    return response;
  }

  // Method for fetching the list of users
  public async getUserList(): Promise<ApiResponse<GetUserListResponse>> {
    const response = await httpClient.get<GetUserListResponse>("/contact/all");
    return response;
  }

  public async fetchAI(
    requestData: FetchAIRequest
  ): Promise<ApiResponse<FetchAIResponse>> {
    const response = await httpClient.post<FetchAIResponse>(
      "/get-sample-text",
      requestData
    );
    return response;
  }
}

const usersApi = new UserApi();
export default usersApi;

import { Result } from "../Result";
import {
  CreateUserRequest,
  GetUserListResponse,
  CreateUserResponse,
  FetchAIRequest,
  FetchAIResponse,
} from "./user.api.interface";
import usersApi from "./UserApi";

class UserManager {
  // create user
  public async createUser(requestData: CreateUserRequest): Promise<Result<CreateUserResponse>> {
    try {
      const response = await usersApi.createUser(requestData);

      if (response.success) {
        return {
          success: true,
          value: {
            id: response.value.id,
            email: response.value.email,
            username: response.value.username,
          },
        };
      } else {
        return { success: false, message: response.error.message };
      }
    } catch (error: any) {
      console.error("UserManager -> createUser failed:", error);
      const errorResponse = JSON.parse(error.request.response);
      if ("message" in errorResponse) {
        return { success: false, message: errorResponse.message };
      } else {
        return { success: false, message: "Unable to create user" };
      }
    }
  }

  // New method to get the list of users
  public async getUserList(): Promise<Result<GetUserListResponse>> {
    try {
      const response = await usersApi.getUserList();

      if (response.success) {
        return {
          success: true,
          value: {
            data: response.value.data.map((user: any) => ({
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phoneNumber: user.phoneNumber,
            })),
          },
        };
      } else {
        return { success: false, message: response.error.message };
      }
    } catch (error: any) {
      console.error("UserManager -> getUserList failed:", error);
      return { success: false, message: "Unable to fetch user list" };
    }
  }

  // New method to fetch AI-generated text
  public async fetchAI(message: string): Promise<Result<FetchAIResponse>> {
    try {
      const requestData: FetchAIRequest = { message }; // Prepare request
      const response = await usersApi.fetchAI(requestData); // Call API

      if (response.success) {
        return {
          success: true,
          value: response.value, // Return the AI-generated text
        };
      } else {
        return { success: false, message: response.error.message };
      }
    } catch (error: any) {
      console.error("UserManager -> fetchAI failed:", error);
      return { success: false, message: "Unable to fetch AI response" };
    }
  }
}

// Export the instance
const userManager = new UserManager();
export default userManager;

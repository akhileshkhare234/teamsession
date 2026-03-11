export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  groups?: number[];
}

export interface CreateUserResponse {
  id: string;
  username: string;
  email: string;
}

// Existing interfaces

export interface GetUserListResponse {
  data: UserInfoModel[];
}

export interface UserInfoModel {
  id: number; // Assuming id is a number based on the example
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

// user.api.interface.ts (or a separate file like ai.api.interface.ts)
export interface FetchAIRequest {
  message: string;
}

export interface FetchAIResponse {
  generatedText: string;
}

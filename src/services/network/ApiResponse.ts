export type ApiResponse<T> =
  | { message(message: any): unknown; success: true; value: T }
  | {
      message(message: any): unknown;
      success: false;
      error: ApiError;
    };

export interface ApiError {
  code: number;
  message: string;
}

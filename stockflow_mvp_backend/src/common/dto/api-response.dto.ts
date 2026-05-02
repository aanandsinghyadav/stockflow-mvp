export class ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static ok<T>(message: string, data?: T): ApiResponse<T> {
    return new ApiResponse(true, message, data);
  }

  static error(message: string): ApiResponse<null> {
    return new ApiResponse(false, message);
  }
}

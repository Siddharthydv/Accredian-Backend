export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    token?: string;
    user?: T;
  }
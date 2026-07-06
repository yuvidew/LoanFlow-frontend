export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "VIEWER";
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  data: User;
}

export interface CurrentUserResponse {
  success: boolean;
  message: string;
  data: User;
}

import http from "./http";
import { User, UserRole } from "../types";

/* =========================
   LOGIN
========================= */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;

  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

/* =========================
   REGISTER
========================= */

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterResponse {
  message: string;
  email?: string;
}

/* =========================
   OTP VERIFICATION
========================= */

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
}

/* =========================
   RESEND OTP
========================= */

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  message: string;
}

/* =========================
   FORGOT PASSWORD
========================= */

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

/* =========================
   RESET PASSWORD
========================= */

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

/* =========================
   CHANGE PASSWORD
========================= */

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

/* =========================
   REFRESH TOKEN
========================= */

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
}

/* =========================
   AUTH API
========================= */

export const authApi = {
  login: async (
    request: LoginRequest,
  ): Promise<LoginResponse> => {
    const response = await http.post<LoginResponse>(
      "/api/v1/auth/login",
      request,
    );

    return response.data;
  },

  register: async (
    request: RegisterRequest,
  ): Promise<RegisterResponse> => {
    const response = await http.post<RegisterResponse>(
      "/api/v1/auth/register",
      request,
    );

    return response.data;
  },

  verifyOtp: async (
  request: VerifyOtpRequest,
): Promise<VerifyOtpResponse> => {
  const response = await http.post<VerifyOtpResponse>(
    "/api/v1/auth/verify-email",
    request,
  );

  return response.data;
},

  resendOtp: async (
    request: ResendOtpRequest,
  ): Promise<ResendOtpResponse> => {
    const response = await http.post<ResendOtpResponse>(
      "/api/v1/auth/resend-otp",
      request,
    );

    return response.data;
  },

  forgotPassword: async (
    request: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> => {
    const response =
      await http.post<ForgotPasswordResponse>(
        "/api/v1/auth/forgot-password",
        request,
      );

    return response.data;
  },

  resetPassword: async (
    request: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> => {
    const response =
      await http.post<ResetPasswordResponse>(
        "/api/v1/auth/reset-password",
        request,
      );

    return response.data;
  },

  changePassword: async (
    request: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> => {
    const response =
      await http.post<ChangePasswordResponse>(
        "/api/v1/auth/change-password",
        request,
      );

    return response.data;
  },

  refreshToken: async (
    request: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> => {
    const response =
      await http.post<RefreshTokenResponse>(
        "/api/v1/auth/refresh-token",
        request,
      );

    return response.data;
  },
};

/* =========================
   LOGIN RESPONSE → USER
========================= */

export const mapLoginResponseToUser = (
  response: LoginResponse,
): User => {
  const fullName = [
    response.firstName,
    response.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    id: response.id,
    name: fullName || response.email,
    email: response.email,
    role: response.role,
  };
};
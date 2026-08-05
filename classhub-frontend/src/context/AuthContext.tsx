import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { AxiosError } from "axios";

import { User, UserRole } from "../types";

import {
  authApi,
  LoginResponse,
  mapLoginResponseToUser,
} from "../api/authApi";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    email: string,
    password: string,
  ) => Promise<User>;

  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: UserRole,
  ) => Promise<string>;

  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined,
  );

const TOKEN_KEY = "classhub_token";
const USER_KEY = "classhub_user";

function getErrorMessage(
  error: unknown,
): string {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as
      | {
          message?: string;
          error?: string;
        }
      | undefined;

    return (
      responseData?.message ||
      responseData?.error ||
      "Unable to connect to the server."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

function extractToken(
  response: LoginResponse,
): string {
  if (!response.accessToken) {
    throw new Error(
      "The login response did not contain an access token.",
    );
  }

  return response.accessToken;
}

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    try {
      const storedToken =
        localStorage.getItem(TOKEN_KEY);

      const storedUser =
        localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        const parsedUser =
          JSON.parse(storedUser) as User;

        setToken(storedToken);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error(
        "Failed to restore authentication session:",
        error,
      );

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<User> => {
    setIsLoading(true);

    try {
      const response =
        await authApi.login({
          email: email.trim(),
          password,
        });

      const receivedToken =
        extractToken(response);

      const loggedInUser =
        mapLoginResponseToUser(response);

      localStorage.setItem(
        TOKEN_KEY,
        receivedToken,
      );

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(loggedInUser),
      );

      setToken(receivedToken);
      setUser(loggedInUser);

      return loggedInUser;
    } catch (error) {
      throw new Error(
        getErrorMessage(error),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: UserRole,
  ): Promise<string> => {
    setIsLoading(true);

    try {
      const response =
        await authApi.register({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
          role,
        });

      return (
        response.message ||
        "Registration successful. Please verify your email."
      );
    } catch (error) {
      throw new Error(
        getErrorMessage(error),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(
          user && token,
        ),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider",
    );
  }

  return context;
};
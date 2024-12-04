import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
const apiUrl = import.meta.env.VITE_BACKEND_URL;
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getApiUrl() {
  if (apiUrl) {
    return apiUrl;
  }
  throw new Error("API URL is not defined");
}

// utils/validateForm.ts

export const validateForm = <T>(data: T, schema: z.ZodSchema<T>) => {
  try {
    const validatedData = schema.parse(data);
    return { validatedData, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors: Partial<Record<keyof T, string>> = {};
      error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof T;
        formattedErrors[key] = issue.message;
      });
      return { validatedData: null, errors: formattedErrors };
    }
    throw error; // Rethrow unexpected errors
  }
};


import axios, { AxiosRequestConfig } from 'axios';

// Create an Axios instance with the base URL from the environment
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Ensure this is set in your .env file
  headers: {
    'Content-Type': 'application/json',
  },
});

// Utility function to make API calls
export const apiCall = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: Record<string, unknown>,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.request<T>({
      url: endpoint,
      method,
      data,
      ...config,
    });

    console.log("RESPONSE : ", response);
    return response.data;
  } catch (error: any) {
    console.error(`API call error on ${method} ${endpoint}:`, error);
    throw error.response?.data || error.message;
  }
};

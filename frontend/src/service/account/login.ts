import type { LoginFormData } from "../../features/schemas/loginSchema";
import { api } from "../../hooks/axios";
import { type AuthResponse } from "../../features/types/betterAuth";

export async function loginRequest(data: LoginFormData): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/auth/sign-in/email', data);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
    throw new Error(errorMessage);
  }
}

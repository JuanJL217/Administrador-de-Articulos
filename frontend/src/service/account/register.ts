import type { RegisterFormData } from '../../features/schemas/registerSchema';
import { api } from "../../hooks/axios";
import { type AuthResponse } from "../../features/types/betterAuth";

export async function registerRequest(data: RegisterFormData): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/auth/sign-up/email', data);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Error al registrar la cuenta';
    throw new Error(errorMessage);
  }
}
import { api } from "../../hooks/axios";

export interface SignOutResponse {
  success?: boolean;
}

export async function logoutRequest(): Promise<SignOutResponse> {
  try {
    const response = await api.post<SignOutResponse>('/auth/sign-out', {});
    
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.response?.data?.success || 'Error al cerrar sesión';
    throw new Error(errorMessage);
  }
}
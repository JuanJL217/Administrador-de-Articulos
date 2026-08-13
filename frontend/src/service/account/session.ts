import { api } from "../../hooks/axios";
import { type AuthResponse } from "../../features/types/betterAuth";

export async function getSessionRequest() : Promise<AuthResponse | null> {
  try {
    const response = await api.get<AuthResponse>('/auth/get-session');

    return response.data?.user ? response.data : null;
    
  } catch (error) {
    return null;
  }
}
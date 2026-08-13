import { API_URL_ARTICLE } from "./urlArticleApi";
import { api } from "../../hooks/axios";

export async function deleteArticleRequest(id: string) {
    try {
        const response = await api.delete(`${API_URL_ARTICLE}/${id}`);
        
        return response.data;
        
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Error al eliminar el artículo";
        throw new Error(errorMessage);
    }
}
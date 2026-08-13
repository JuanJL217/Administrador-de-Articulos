import { API_URL_ARTICLE } from "./urlArticleApi";
import { type ArticleData, articleSchema } from "../../features/schemas/article/articleSchema";
import { api } from "../../hooks/axios";

export type CreateArticleInput = Omit<ArticleData, 'id' | 'createdAt'>;

export async function createArticleRequest(data: CreateArticleInput) : Promise<ArticleData> {
    try {
        const response = await api.post(`${API_URL_ARTICLE}`, data);
        
        const validatedData = articleSchema.parse(response.data);

        return validatedData;

    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Error al crear el artículo';
        throw new Error(errorMessage);
    }
}
import { articleSchema, type ArticleData } from "../../features/schemas/article/articleSchema";
import { paginatedArticlesSchema, type PaginatedArticlesResponse} from "../../features/schemas/article/paginationArticleSchema";
import { API_URL_ARTICLE } from "./urlArticleApi";
import { api } from "../../hooks/axios";



export async function getMyArticles(
    page: number,
    limit: number
): Promise<PaginatedArticlesResponse> {
    try {
        const response = await api.get(`${API_URL_ARTICLE}/my-articles?page=${page}&limit=${limit}`);
        
        const validatedData = paginatedArticlesSchema.parse(response.data);
        return validatedData;

    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Error al obtener tus artículos';
        throw new Error(errorMessage);
    }
}

export async function getArticlesFiltered(data: {
    page: number,
    limit: number,
    author?: string,
    title?: string,
    content?: string
}): Promise<PaginatedArticlesResponse> {
    try {
        const { page, limit, author, title, content } = data;

        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('limit', String(limit));

        if (author) params.append('author', author);
        if (title) params.append('title', title);
        if (content) params.append('content', content);

        const response = await api.get(`${API_URL_ARTICLE}?${params.toString()}`);

        const validatedData = paginatedArticlesSchema.parse(response.data);
        return validatedData;

    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Error en el servidor';
        throw new Error(errorMessage);
    }
}

export async function getPrivateDataFromArticule(
    id: string
) : Promise<ArticleData> {
    try {
        const response = await api.get(`${API_URL_ARTICLE}/${id}`);
        
        const validatedData = articleSchema.parse(response.data);
        return validatedData;

    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Error obteniendo el artículo';
        throw new Error(errorMessage);
    }
}
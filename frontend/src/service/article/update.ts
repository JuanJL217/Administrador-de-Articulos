import { type ArticleData, articleSchema} from "../../features/schemas/article/articleSchema";
import { API_URL_ARTICLE } from "./urlArticleApi";
import { api } from "../../hooks/axios";

export type UpdateArticleInput = Omit<ArticleData, 'createdAt'>;

export async function updateArticleRequest(data: UpdateArticleInput) : Promise<ArticleData> {
    try {
        const response = await api.patch(`${API_URL_ARTICLE}/${data.id}`, {
            title: data.title,
            content: data.content,
            urlImage: data.urlImage
        });

        const validatedData = articleSchema.parse(response.data);
        return validatedData;

    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Error al actualizar el artículo';
        throw new Error(errorMessage);
    }
}
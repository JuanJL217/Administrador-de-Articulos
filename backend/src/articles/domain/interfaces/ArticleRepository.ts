import { Article } from "../Article";

export const ARTICLE_REPOSITORY_TOKEN_INJECTION = 'ArticleRepository';

export interface PaginationOptions {
    page: number;
    limit: number;
}

export interface PaginatedArticlesResult {
    data: Article[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ArticleFilters {
    options: PaginationOptions,
    author?: string;
    title?: string;
    content?: string;
}

export interface ArticleRepository {
    
    getArticlesFiltered(filters: ArticleFilters): Promise<PaginatedArticlesResult>;
    getArticlesByUserId(userId: string, options: PaginationOptions): Promise<PaginatedArticlesResult>;
    findById(id: string): Promise<Article | null>;
    findTitleByAuthor(authorId: string, title: string): Promise<Article | null>;
    delete(article: Article): Promise<void>;
    save(article: Article): Promise<void>;

}
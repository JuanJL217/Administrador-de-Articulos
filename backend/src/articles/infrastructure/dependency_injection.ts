import { container } from 'tsyringe';
import { MongoDbArticleRepository } from './mongoDbArticleRepository/MongoDbArticleRepository';
import { ARTICLE_REPOSITORY_TOKEN_INJECTION, type ArticleRepository } from '../domain/interfaces/ArticleRepository';

export class ArticleModuleContainer {
    public static register(): void {
        container.registerSingleton<ArticleRepository>(
            ARTICLE_REPOSITORY_TOKEN_INJECTION,
            MongoDbArticleRepository
        )
    }
}
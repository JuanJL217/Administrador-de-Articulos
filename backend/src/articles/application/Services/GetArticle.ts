import { singleton, inject } from "tsyringe";
import { type ArticleRepository, ARTICLE_REPOSITORY_TOKEN_INJECTION } from "../../domain/interfaces/ArticleRepository";

@singleton()
export class GetArticle {

    constructor(
        @inject(ARTICLE_REPOSITORY_TOKEN_INJECTION)
        private articleRepository: ArticleRepository
    ){}

    public async execute(articleId: string) {
        const article = await this.articleRepository.findById(articleId);
        if (!article) {
            throw new Error('Articulo no encontrado');
        }
        return article;
    }

    public async getAll(paginated: {
        page: number, 
        limit: number
    }) {
        const paginatedResult = await this.articleRepository.getAllArticles({ page: paginated.page, limit: paginated.limit });

        const { data, ...paginationMetadata } = paginatedResult;

        return {
            articles: {
                data: data.map(article => article.toPrimitives()),
                ...paginationMetadata 
            }
        };
    }
}
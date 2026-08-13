import { singleton, inject } from "tsyringe";
import { ARTICLE_REPOSITORY_TOKEN_INJECTION, type ArticleRepository } from "../../domain/interfaces/ArticleRepository";
import { USER_REPOSITORY_TOKEN_INJECTION, type UserRepository } from "../../../user/domain/interfaces/UserRepository";

@singleton()
export class GetArticle {

    constructor(
        @inject(ARTICLE_REPOSITORY_TOKEN_INJECTION)
        private articleRepository: ArticleRepository,

        @inject(USER_REPOSITORY_TOKEN_INJECTION)
        private userRepository: UserRepository
    ){}

    public async execute(articleId: string) {
        const article = await this.articleRepository.findById(articleId);
        if (!article) {
            throw new Error('Articulo no encontrado');
        }
        return article;
    }

    public async getArticlesByUserId(userId: string, paginated: {
        page: number, 
        limit: number
    }) {
        const paginatedResult = await this.articleRepository.getArticlesByUserId(userId, paginated);
        const { data, ...paginationMetadata } = paginatedResult;

        return {
            data: data.map(article => article.getData()),
            meta: paginationMetadata
        };
    }

    public async getArticlesFiltered(filters :{
        page: number,
        limit: number,
        author?: string,
        title?: string,
        content?: string
    }) {
        const paginatedResult = await this.articleRepository.getArticlesFiltered({
            options: {
                page: filters.page,
                limit: filters.limit
            },
            ...filters
        });

        const { data, ...paginationMetadata } = paginatedResult;

        return {
            data: data.map(article => article.publicData()),
            meta: paginationMetadata
        };      
        
    }

    public async getPrivateData(articleId: string) {
        const articule = await this.articleRepository.findById(articleId);
        if (!articule) {
            throw new Error('Articulo no encontrado');
        }

        const author = await this.userRepository.findById(articule.getAuthorId());

        if (!author) {
            throw new Error('Autor no encontrado');
        }

        return {
            author: author.getName(),
           ...articule.getData()
        }
    }
}
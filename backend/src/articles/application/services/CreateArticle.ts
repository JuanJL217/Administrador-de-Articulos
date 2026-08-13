import { singleton, inject } from "tsyringe";
import { type ArticleRepository, ARTICLE_REPOSITORY_TOKEN_INJECTION } from "../../domain/interfaces/ArticleRepository";
import { Article, type DTOArticle } from "../../domain/Article";
import { ArticleTitleAlreadyExistsError } from "../../domain/error/ArticleTitleAlreadyExistsError";

@singleton()
export class CreateArticle {

    constructor(
        @inject(ARTICLE_REPOSITORY_TOKEN_INJECTION)
        private articleRepository: ArticleRepository
    ){}

    public async execute(data: {
        authorId: string
        title: string
        content: string
        urlImage?: string
    }) : Promise<DTOArticle> {
        
        const existingArticle = await this.articleRepository.findTitleByAuthor(data.authorId, data.title);
        
        if (existingArticle) {
            throw new ArticleTitleAlreadyExistsError(data.title);
        }

        const article = Article.createArticle({
            id: crypto.randomUUID(),
            authorId: data.authorId,
            title: data.title,
            content: data.content,
            urlImage: data.urlImage
        });

        await this.articleRepository.save(article);

        return article.publicData()

    }
}
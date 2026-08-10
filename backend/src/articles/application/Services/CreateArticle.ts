import { singleton, inject } from "tsyringe";
import { type ArticleRepository, ARTICLE_REPOSITORY_TOKEN_INJECTION } from "../../domain/interfaces/ArticleRepository";
import { Article, type DTOArticle } from "../../domain/Article";

@singleton()
export class CreateArticle {

    constructor(
        @inject(ARTICLE_REPOSITORY_TOKEN_INJECTION)
        private articleRepository: ArticleRepository
    ){}

    public async execute(data: {
        authorId: string
        tittle: string
        content: string
        urlImage?: string
    }) : Promise<DTOArticle> {
        
        const existingArticle = await this.articleRepository.findByAuthorAndTitle(data.authorId, data.tittle);
        if (existingArticle) {
            throw new Error('Ya existe este titulo para este autor');
        }

        const article = Article.createArticle({
            id: crypto.randomUUID(),
            authorId: data.authorId,
            tittle: data.tittle,
            content: data.content,
            urlImage: data.urlImage
        });

        await this.articleRepository.save(article);

        return article.toPrimitives()

    }
}
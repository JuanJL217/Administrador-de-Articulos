import { inject, singleton } from "tsyringe"
import { ARTICLE_REPOSITORY_TOKEN_INJECTION, type ArticleRepository } from "../../domain/interfaces/ArticleRepository"
import type { DTOArticle } from "../../domain/Article"

@singleton()
export class UpdateArticle {

    constructor(
        @inject(ARTICLE_REPOSITORY_TOKEN_INJECTION)
        private articleRepository: ArticleRepository
    ){}

    public async execute(data: {
        id: string
        authorId: string
        tittle: string
        content: string
        urlImage: string | undefined
    }) : Promise<DTOArticle> {
        
        const article = await this.articleRepository.findById(data.id);
        if (!article) {
            throw new Error('Articulo no encontrado');
        }

        if (!article.belongsTo(data.authorId)) {
            throw new Error('No sos el propietario del articulo');
        }

        article.update({
            tittle: data.tittle,
            content: data.content,
            urlImage: data.urlImage
        });

        await this.articleRepository.save(article);

        return article.toPrimitives()
    }

}
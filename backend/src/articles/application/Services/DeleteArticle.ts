import { inject, singleton } from "tsyringe"
import { ARTICLE_REPOSITORY_TOKEN_INJECTION, type ArticleRepository } from "../../domain/interfaces/ArticleRepository"

@singleton()
export class DeleteArticle {

    constructor(
        @inject(ARTICLE_REPOSITORY_TOKEN_INJECTION)
        private articleRepository: ArticleRepository
    ){}

    public async execute(data: {
        id: string
        authorId: string
    }) {
        
        const article = await this.articleRepository.findById(data.id);
        if (!article) {
            throw new Error('Articulo no encontrado');
        }

        if (!article.belongsTo(data.authorId)) {
            throw new Error('No sos el propietario del articulo para poder eliminarlo');
        }

        await this.articleRepository.delete(article);

    }

}
import { inject, injectable } from "tsyringe";
import { GetArticle } from "../../../application/Services/GetArticle";
import { CreateArticle } from "../../../application/Services/CreateArticle";
import { Context } from 'hono';
import { UpdateArticle } from "../../../application/Services/UpdateArticle";
import { DeleteArticle } from "../../../application/Services/DeleteArticle";
import { CatchErrors } from "../../../../infrastructure/decorators/catchErrors";

@injectable()
export class ArticleController {
    constructor(
        @inject(GetArticle)
        private getArticleService: GetArticle,
        
        @inject(CreateArticle)
        private createArticleService: CreateArticle,

        @inject(UpdateArticle)
        private updateArticleService: UpdateArticle,

        @inject(DeleteArticle)
        private deleteArticleService: DeleteArticle
    ){}

    @CatchErrors()
    public async getAllArticles(c: Context) {
        const paginated = {
            page: Number(c.req.query('page')),
            limit: Number(c.req.query('limit'))
        };
        const articles = await this.getArticleService.getAll(paginated);
        return c.json(articles, 200);
    }

    @CatchErrors()
    // @ValidatedSchema(CreateArticleSchema)
    public async createArticle(c: Context) {
        const user = c.get('user');
        const body = await c.req.json();
        
        const articleCreated = await this.createArticleService.execute({
            authorId: user.id,
            tittle: body.tittle,
            content: body.content,
            urlImage: body.urlImage
        });

        return c.json({
            articleCreated,
            message : 'Artículo creado exitosamente'
        }, 201);
    }

    @CatchErrors()
    public async updateArticle(c: Context) {
        const user = c.get('user');
        const body = await c.req.json();
        const articleId = c.req.param('id');

        const articleUpdated = await this.updateArticleService.execute({
            id: articleId!,
            authorId: user.id,
            tittle: body.tittle,
            content: body.content,
            urlImage: body.urlImage
        });

        return c.json({
            articleUpdated,
            message: 'Articulo editado correctamente'
        }, 200);
    }
    
    @CatchErrors()
    public async deleteArticle(c: Context) {
        const user = c.get('user');
        const articleId = c.req.param('id');

        await this.deleteArticleService.execute({
            id: articleId!,
            authorId: user.id
        });

        return c.json({
            message: 'Articulo eliminado correctamente'
        }, 200);
    }
}
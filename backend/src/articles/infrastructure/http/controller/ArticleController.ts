import { inject, injectable } from "tsyringe";
import { GetArticle } from "../../../application/Services/GetArticle";
import { CreateArticle } from "../../../application/Services/CreateArticle";
import { Context } from 'hono';
import { UpdateArticle } from "../../../application/Services/UpdateArticle";
import { DeleteArticle } from "../../../application/Services/DeleteArticle";
import { CatchErrors } from "../../../../infrastructure/decorators/catchErrors";
import { ValidateSchema, validBody, validParam, validQuery} from "../../../../infrastructure/decorators/validateSchemas";
import { createArticleBodySchema } from "./Schema/CreateArticleSchema";
import { updateArticleBodySchema } from "./Schema/UpdateArticleSchema";
import { articuleIdParamSchema } from "./Schema/ArticleIddParamsSchema";
import { paginationQuerySchema } from "./Schema/PaginationQuerySchema";

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
    @ValidateSchema(paginationQuerySchema, "query")
    public async getAllArticles(c: Context) {
        const query = c.get(validQuery);
        const articles = await this.getArticleService.getAll(query);
        return c.json(articles, 200);
    }

    @CatchErrors()
    @ValidateSchema(createArticleBodySchema, "body")
    public async createArticle(c: Context) {
        const user = c.get('user');
        const body = c.get(validBody);
        
        const articleCreated = await this.createArticleService.execute({
            authorId: user.id,
            tittle: body.tittle,
            content: body.content,
            urlImage: body.urlImage
        });

        return c.json({
            data: articleCreated,
            message : 'Artículo creado exitosamente'
        }, 201);
    }

    @CatchErrors()
    @ValidateSchema(articuleIdParamSchema, "param")
    @ValidateSchema(updateArticleBodySchema, "body")
    public async updateArticle(c: Context) {
        const user = c.get('user');
        const body = c.get(validBody);
        const param = c.get(validParam);

        const articleUpdated = await this.updateArticleService.execute({
            id: param.id,
            authorId: user.id,
            tittle: body.tittle,
            content: body.content,
            urlImage: body.urlImage
        });

        return c.json({
            data: articleUpdated,
            message: 'Articulo editado correctamente'
        }, 200);
    }
    
    @CatchErrors()
    @ValidateSchema(articuleIdParamSchema, "param")
    public async deleteArticle(c: Context) {
        const user = c.get('user');
        const param = c.get(validParam);

        await this.deleteArticleService.execute({
            id: param.id,
            authorId: user.id
        });

        return c.json({
            message: 'Articulo eliminado correctamente'
        }, 200);
    }
}
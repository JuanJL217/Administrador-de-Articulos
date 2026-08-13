import { inject, injectable } from "tsyringe";
import { GetArticle } from "../../../application/services/GetArticle";
import { CreateArticle } from "../../../application/services/CreateArticle";
import { Context } from 'hono';
import { UpdateArticle } from "../../../application/services/UpdateArticle";
import { DeleteArticle } from "../../../application/services/DeleteArticle";
import { CatchErrors } from "../../../../infrastructure/decorators/catchErrors";
import { ValidateSchema, validBody, validParam, validQuery} from "../../../../infrastructure/decorators/validateSchemas";
import { createArticleBodySchema } from "./Schema/CreateArticleSchema";
import { updateArticleBodySchema } from "./Schema/UpdateArticleSchema";
import { articuleIdParamSchema } from "./Schema/ArticleIddParamsSchema";
import { paginationQuerySchema } from "./Schema/PaginationQuerySchema";
import { paginationFilteredQuerySchema } from "./Schema/PaginationFilteredQuerySchema";

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
    @ValidateSchema(paginationFilteredQuerySchema, "query")
    public async getArticlesFiltered(c: Context) {
        const query = c.get(validQuery);
        const articles = await this.getArticleService.getArticlesFiltered(query);
        return c.json(articles, 200);
    }

    @CatchErrors()
    @ValidateSchema(createArticleBodySchema, "body")
    public async createArticle(c: Context) {
        const user = c.get('user');
        const body = c.get(validBody);
        
        const articleCreated = await this.createArticleService.execute({
            authorId: user.id,
            title: body.title,
            content: body.content,
            urlImage: body.urlImage
        });

        return c.json(articleCreated, 201);
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
            title: body.title,
            content: body.content,
            urlImage: body.urlImage
        });

        return c.json(articleUpdated, 200);
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

        return c.json(200);
    }

    @CatchErrors()
    @ValidateSchema(paginationQuerySchema, "query")
    public async getMyArticles(c: Context) {
        const user = c.get('user');
        const query = c.get(validQuery);
        
        const articles = await this.getArticleService.getArticlesByUserId(user.id, query);
        return c.json(articles, 200);
    }

    @CatchErrors()
    @ValidateSchema(articuleIdParamSchema, "param")
    public async getPrivateData(c: Context) {
        const query = c.get(validParam);
        const privateData = await this.getArticleService.getPrivateData(query.id);
        return c.json(privateData, 200);
    }
}
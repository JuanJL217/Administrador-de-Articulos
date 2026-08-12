import { inject, injectable } from 'tsyringe';
import { Hono } from 'hono';
import { ArticleController } from '../controller/ArticleController';
import { AuthMiddleware } from '../../../../infrastructure/auth/AuthMiddleware';

@injectable()
export class ArticleRouter {
    public readonly router: Hono;

    constructor(
        @inject(AuthMiddleware)
        private authMiddleware: AuthMiddleware,

        @inject(ArticleController)
        private articleController: ArticleController
    ) {
        this.router = new Hono();
        this.setupRoutes();
    }

    private setupRoutes(): void {


        this.router.get(
            '/my-articles',
            (c, next) => this.authMiddleware.requireAuth(c, next),
            (c) => this.articleController.getMyArticles(c)
        )

        this.router.get(
            '/:id',
            (c, next) => this.authMiddleware.requireAuth(c, next),
            (c) => this.articleController.getPrivateData(c)
        )

        this.router.patch(
            '/:id',
            (c, next) => this.authMiddleware.requireAuth(c, next),
            (c) => this.articleController.updateArticle(c)
        )

        this.router.delete(
            '/:id',
            (c, next) => this.authMiddleware.requireAuth(c, next),
            (c) => this.articleController.deleteArticle(c)
        )

        this.router.get(
            '/',
            (c) => this.articleController.getArticlesFiltered(c)
        )

        this.router.post(
            '/',
            (c, next) => this.authMiddleware.requireAuth(c, next),
            (c) => this.articleController.createArticle(c)
        );

    }
}
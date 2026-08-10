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
            '/',
            (c) => this.articleController.getAllArticles(c)
        )

        this.router.post(
            '/',
            (c, next) => this.authMiddleware.requireAuth(c, next),
            (c) => this.articleController.createArticle(c)
        );

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
    }
}
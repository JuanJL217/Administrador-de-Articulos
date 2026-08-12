import { autoInjectable, inject, injectable } from 'tsyringe';
import { Context, Hono } from 'hono';
import { UserController } from '../controllers/UserController';

@injectable()
export class UserRouter {
    public readonly router: Hono;

    constructor(
        @inject(UserController)
        private userController: UserController,
    ) {
        this.router = new Hono();
        this.setupRoutes();
    }

    private setupRoutes(): void {

        this.router.get(
            '/authors-stats',
            (c) => this.userController.getAuthorsStats(c)
        )
        
    }
}
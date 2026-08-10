import { autoInjectable, inject, injectable } from 'tsyringe';
import { Context, Hono } from 'hono';
import { AuthService } from '../../../../infrastructure/auth/AuthService';

@injectable()
export class UserRouter {
    public readonly router: Hono;

    constructor(
        private authService: AuthService,
    ) {
        this.router = new Hono();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.on(['POST', 'GET'], '/api/auth/**', (c: Context) => {
            return this.authService.handleRequest(c.req.raw);
        });
    }
}
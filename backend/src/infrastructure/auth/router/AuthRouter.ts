import { Hono, Context } from 'hono';
import { AuthService } from '../AuthService';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AuthRouter {

    public readonly router: Hono;

    constructor(
        @inject(AuthService)
        private authService: AuthService
    ){
        this.router = new Hono();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.on(['POST', 'GET', 'OPTIONS'], '/**', (c: Context) => {
            return this.authService.handleRequest(c.req.raw);
        });
    }

}
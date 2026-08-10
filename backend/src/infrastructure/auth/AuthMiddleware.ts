import { Context } from 'hono';
import type { Next } from 'hono';
import { AuthService } from './AuthService';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AuthMiddleware {
    constructor(
        @inject(AuthService)
        private readonly authService: AuthService
    ) {}

    public async requireAuth(c: Context, next: Next) {
        const sessionData = await this.authService.validateRequest(c.req.raw);

        if (!sessionData || !sessionData.session) {
            return c.json({ 
                success: false, 
                error: 'Acceso no autorizado'
            }, 401);
        }

        c.set('user', sessionData.user);
        await next();
    };
}
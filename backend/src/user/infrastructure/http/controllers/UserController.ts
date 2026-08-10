import { autoInjectable, injectable } from 'tsyringe';
import { Context } from 'hono';
import { GetUserService } from '../../../application/GetUserService';

@injectable()
export class UserController {
    constructor(
        private getUserService: GetUserService
    ) {}

    public async getUser(c: Context) {
        try {
            const authUser = c.get('user');        
            
            if (!authUser || !authUser.id) {
                return c.json({ 
                    success: false, 
                    error: 'Usuario no autenticado' 
                }, 401);
            }
            
            const user = await this.getUserService.execute(authUser.id);

            return c.json({ 
                success: true, 
                data: user }, 
            200);
            
        } catch (error: any) {
            return c.json({ 
                success: false, 
                error: error.message }, 
            404);
        }
    }
}
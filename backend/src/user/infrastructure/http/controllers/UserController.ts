import { autoInjectable, inject, injectable } from 'tsyringe';
import { Context } from 'hono';
import { GetAuthorStats } from '../../../application/services/GetAuthorStats';
import { CatchErrors } from '../../../../infrastructure/decorators/catchErrors';

@injectable()
export class UserController {
    constructor(
        @inject(GetAuthorStats)
        private getAuthorStats: GetAuthorStats
    ) {}

    @CatchErrors()
    public async getAuthorsStats(c: Context) {
        const authorsStats = await this.getAuthorStats.execute();
        return c.json(authorsStats, 200);
    }
}
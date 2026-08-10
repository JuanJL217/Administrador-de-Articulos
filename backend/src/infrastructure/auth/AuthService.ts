import { inject, singleton } from "tsyringe";
import { betterAuth } from "better-auth";
import { Db } from "mongodb";
import { DATA_BASE_TOKEN_INJECTION } from "../container/AppContainer";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

@singleton()
export class AuthService {

    private authInstance;

    constructor(
        @inject("Db")
        private db: Db
    ) {
        this.authInstance = betterAuth({
            baseUrl: process.env.BETTER_AUTH_URL,
            database : mongodbAdapter(this.db),
            emailAndPassword: {
                enabled: true,
                autoSignIn: true
            },
            trustedOrigins: [
                process.env.FRONTED_URL!
            ],
        })
    }

    public async handleRequest(req: Request) : Promise<Response> {
        return await this.authInstance.handler(req);

    }

    public async validateRequest(req: Request) { 
        return await this.authInstance.api.getSession({
            headers: req.headers
        })
    }

}
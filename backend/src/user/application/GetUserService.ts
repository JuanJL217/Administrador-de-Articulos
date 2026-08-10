import { singleton } from "tsyringe";
import { inject } from "tsyringe";
import { User } from "../domain/User";
import { USER_REPOSITORY_TOKEN_INJECTION, type UserRepository } from "../domain/interfaces/UserRepository";

@singleton()
export class GetUserService {

    constructor(
        @inject(USER_REPOSITORY_TOKEN_INJECTION)
        private userRepository: UserRepository
    ){}

    public async execute(userId: string): Promise<User> {
        const user = await this.userRepository.findById(userId);
        
        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        return user;
    }
}
import { singleton } from "tsyringe";
import { inject } from "tsyringe";
import { USER_REPOSITORY_TOKEN_INJECTION, type UserRepository } from "../../domain/interfaces/UserRepository";

@singleton()
export class GetAuthorStats {

    constructor(
        @inject(USER_REPOSITORY_TOKEN_INJECTION)
        private userRepository: UserRepository
    ){}

    public async execute() {
        return await this.userRepository.getAllAuthorsStats();
    }
}
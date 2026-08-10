import { container } from "tsyringe"
import { MongoDbUserRepository } from "./mongoDbUsuariosRepository/MongoDbUserRepository";
import { USER_REPOSITORY_TOKEN_INJECTION, type UserRepository } from "../domain/interfaces/UserRepository";

export class UserModuleContainer {
    public static register() : void {
        container.registerSingleton<UserRepository>(
            USER_REPOSITORY_TOKEN_INJECTION, 
            MongoDbUserRepository
        );
    }
}
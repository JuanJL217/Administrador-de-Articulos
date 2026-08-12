import { container } from "tsyringe";
import type { Db } from "mongodb";
import { UserModuleContainer } from "../../user/infrastructure/dependency_injection";
import { ArticleModuleContainer } from "../../articles/infrastructure/dependency_injection";

export const DATA_BASE_TOKEN_INJECTION = "Db";

export class AppContainer {
    constructor(
      private db: Db
    ){}

    public configure() {
        container.registerInstance<Db>(DATA_BASE_TOKEN_INJECTION, this.db);
        UserModuleContainer.register();
        ArticleModuleContainer.register();
}
}
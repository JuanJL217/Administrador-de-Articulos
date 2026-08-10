import { User } from "../../domain/User";
import type { UserRepository } from "../../domain/interfaces/UserRepository";
import { MongoDbRepository } from "../../../infrastructure/database/MongoDbRepository";
import { inject } from "tsyringe";
import { DATA_BASE_TOKEN_INJECTION } from "../../../infrastructure/container/AppContainer";
import type { Db } from "mongodb";

  export class MongoDbUserRepository extends MongoDbRepository<User> implements UserRepository {

    constructor(
      @inject(DATA_BASE_TOKEN_INJECTION)
      db: Db
    ) {
      super(db);
    }

    protected collectionName(): string {
      return "user";
    }

    protected toDomain(doc: any): User {
      return new User(doc._id.toString(), doc.name, doc.email);
    }

    protected toPersistence(user: User): any {
      return {
        _id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
      };
    }

    public async findById(id: string): Promise<User | null> {
      const doc = await this.collection().findOne({ _id: id as any });
      if (!doc) return null;
      return this.toDomain(doc);
    }

    public async findByEmail(email: string): Promise<User | null> {
      const doc = await this.collection().findOne({ email });
      if (!doc) return null;
      return this.toDomain(doc);
    }

    public async save(user: User): Promise<void> {
      const persistenceData = this.toPersistence(user);
      await this.collection().updateOne(
        { _id: user.getId() as any },
        { $set: persistenceData },
        { upsert: true }
      );
    }
  }
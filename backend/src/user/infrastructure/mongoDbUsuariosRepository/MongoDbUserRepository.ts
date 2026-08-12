import { User } from "../../domain/User";
import type { AuthorStats, UserRepository } from "../../domain/interfaces/UserRepository";
import { MongoDbRepository } from "../../../infrastructure/database/MongoDbRepository";
import { inject, injectable } from "tsyringe";
import type { Db } from "mongodb";

@injectable()
  export class MongoDbUserRepository extends MongoDbRepository<User> implements UserRepository {

    constructor(
      @inject("Db")
      db: Db
    ) {
      super(db);
    }

    protected collectionName(): string {
      return "user";
    }

    protected toDomain(doc: any): User {
      return new User(doc._id, doc.name, doc.email);
    }

    protected toPersistence(user: User): any {
      return {
        _id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
      };
    }

    public async getAllAuthorsStats(): Promise<AuthorStats[]> {
      return await this.collection()
        .aggregate<AuthorStats>([
          {
            $lookup: {
              from: "article",
              localField: "_id",
              foreignField: "authorId",
              as: "articles",
            },
          },
          {
            $project: {
              _id: 0,
              id: "$_id",
              name: 1,
              totalArticles: { $size: "$articles" },
            },
          },
        ])
        .toArray();
    }

    public async findById(id: string): Promise<User | null> {
      const doc = await this.collection().findOne({ _id: id as any });
      if (!doc) return null;
      return this.toDomain(doc);
    }

    // public async findByEmail(email: string): Promise<User | null> {
    //   const doc = await this.collection().findOne({ email });
    //   if (!doc) return null;
    //   return this.toDomain(doc);
    // }

  }
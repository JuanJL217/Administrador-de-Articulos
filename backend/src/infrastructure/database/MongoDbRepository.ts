import { Collection, Db } from "mongodb";

export abstract class MongoDbRepository<T> {
  
  constructor(protected readonly db: Db) {}

  protected abstract collectionName(): string;

  protected collection(): Collection {
    return this.db.collection(this.collectionName());
  }

  protected abstract toDomain(document: any): T;
  protected abstract toPersistence(entity: T): any;
}
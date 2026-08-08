import { MongoClient, Db } from 'mongodb';

export class MongoDatabase {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  public async connect(uri: string, dbName: string): Promise<void> {
    try {
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db(dbName);
      
    } catch (error) {
      console.error('Error al conectar con MongoDB');
      console.error(error);
      process.exit(1);
    }
  }

  public getDatabase(): Db {
    if (!this.db) {
      throw new Error('La base de datos no está inicializada');
    }
    return this.db;
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
    }
  }
}
import { z } from 'zod';
import { type AppConfig, envSchema } from './EnvSchema';

export class EnvironmentConfig {
  private readonly config: AppConfig;

  constructor() {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
      console.error('Variables de entorno inválidas');
      console.error(result.error);
      process.exit(1);
    }

    this.config = result.data;
  }

  public getPort(): number {
    return this.config.PORT;
  }

  public getMongoUri(): string {
    return this.config.MONGO_URI;
  }

  public getDataBaseName(): string {
    return this.config.DB_NAME;
  }
  
}
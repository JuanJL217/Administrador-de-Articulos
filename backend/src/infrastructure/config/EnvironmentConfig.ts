import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number({error: "El puerto debe ser un número válido"}),
  DB_NAME: z.string({error: "El nombre de la base de datos es obligatorio"}),
  MONGO_URI: z.string().url({ error: "La URL es inválida" })
});

export type AppConfig = z.infer<typeof envSchema>;

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
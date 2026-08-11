import { z } from 'zod';
import { envSchema } from './EnvSchema';

export class EnvironmentConfig {

  public static execute() : void {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
      console.error('Variables de entorno inválidas');
      console.error(result.error);
      process.exit(1);
    }
  }
  
}
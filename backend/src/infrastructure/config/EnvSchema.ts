import { z } from 'zod';

type EnvironmentVariables = {
  PORT: number;
  DB_NAME: string;
  MONGO_URI: string;
  BETTER_AUTH_URL: string;
  FRONTED_URL: string;
}

export const envSchema : z.ZodType<EnvironmentVariables> = z.object({
  PORT: z.coerce.number({error: "El puerto debe ser un número válido"}),
  DB_NAME: z.string({error: "El nombre de la base de datos es obligatorio"}),
  MONGO_URI: z.string().url({ error: "La URL es inválida" }),
  BETTER_AUTH_URL: z.string().url({ error: "La URL es inválida" }),
  FRONTED_URL: z.string().url({ error: "La URL es inválida" }),
});
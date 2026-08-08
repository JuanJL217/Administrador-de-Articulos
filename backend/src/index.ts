import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { EnvironmentConfig } from './infrastructure/config/EnvironmentConfig';
import { MongoDatabase } from './infrastructure/database/MongoDatabase';

async function init() {
  console.log('Iniciando sistema');

  const envConfig = new EnvironmentConfig();
  const database = new MongoDatabase();

  await database.connect(envConfig.getMongoUri(), envConfig.getDataBaseName());
  console.log('Conexión a MongoDB establecido');

  const db = database.getDatabase();

  const app = new Hono();

  serve({
    fetch: app.fetch,
    port: envConfig.getPort(),
  });

  console.log(`Servidor corriendo en http://localhost:${envConfig.getPort()}`);
}

init();
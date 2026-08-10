import "reflect-metadata"
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { EnvironmentConfig } from './infrastructure/config/EnvironmentConfig';
import { MongoDbDatabase } from './infrastructure/database/MongoDbDatabase';
import { logger } from 'hono/logger';
import { container } from "tsyringe";
import { AppContainer } from "./infrastructure/container/AppContainer";
import { AuthRouter } from "./infrastructure/auth/router/AuthRouter";
import { ArticleRouter } from "./articles/infrastructure/http/router/ArticleRouter";

async function main() {

  const envConfig = new EnvironmentConfig();
  const database = new MongoDbDatabase();
  await database.connect(process.env.MONGO_URI!, process.env.DB_NAME!);

  const appContainer = new AppContainer(database.getDatabase());
  appContainer.configure();

  const app = new Hono();
  app.use('*', logger());
  app.use('/api/auth/*', cors({
    origin: [process.env.FRONTED_URL!],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));
    
  const authRouter = container.resolve(AuthRouter);
  app.route('/api/auth', authRouter.router);

  const articleRouter = container.resolve(ArticleRouter);
  app.route('/api/articles', articleRouter.router);

  serve({
    fetch: app.fetch,
    port: Number(process.env.PORT!)
  });

  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
}

main();
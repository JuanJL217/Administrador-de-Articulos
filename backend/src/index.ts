import "reflect-metadata"
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { EnvironmentConfig } from './infrastructure/config/EnvironmentConfig';
import { MongoDbDatabase } from './infrastructure/database/MongoDbDatabase';
import { logger } from 'hono/logger';
import { container } from "tsyringe";
import { AppContainer } from "./infrastructure/container/AppContainer";
import { AuthRouter } from "./infrastructure/auth/router/AuthRouter";

async function main() {

  const envConfig = new EnvironmentConfig();
  const database = new MongoDbDatabase();
  await database.connect(process.env.MONGO_URI!, process.env.DB_NAME!);

  const appContainer = new AppContainer(database.getDatabase());
  appContainer.configure();

  const app = new Hono();
  app.use('*', logger());
  
  // const userRouter = container.resolve(UserRouter);
  const authRouter = container.resolve(AuthRouter);
  // const articleRouter = container.resolve(ArticleRouter);

  // app.route('/', userRouter.router);
  app.route('/', authRouter.router);

  serve({
    fetch: app.fetch,
    port: Number(process.env.PORT!)
  });

  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
}

main();
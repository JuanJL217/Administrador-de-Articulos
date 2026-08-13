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
import { UserRouter } from "./user/infrastructure/http/routers/UserRouter";

async function main() {

  try {
    EnvironmentConfig.execute();
    
    const database = new MongoDbDatabase();
    await database.connect(process.env.MONGO_URI!, process.env.DB_NAME!);
    console.log("Conectado a la base de datos exitosamente.");

    const appContainer = new AppContainer(database.getDatabase());
    appContainer.configure();

    const app = new Hono();
    
    app.use('*', logger());
    
    app.use('*', cors({
      origin: process.env.FRONTED_URL!.split(','),
      allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
      maxAge: 600,
      credentials: true,
    }));

    app.onError((err, c) => {
      console.error(`[Error Global]: ${err.message}`);
      return c.json({ error: "Ocurrió un error interno en el servidor." }, 500);
    });
      
    const authRouter = container.resolve(AuthRouter);
    app.route('/api/auth', authRouter.router);

    const userRouter = container.resolve(UserRouter);
    app.route('/api/users', userRouter.router);

    const articleRouter = container.resolve(ArticleRouter);
    app.route('/api/articles', articleRouter.router);

    const port: number = Number(process.env.PORT) || 3000;

    serve({
      fetch: app.fetch,
      port: port,
      hostname: '0.0.0.0'
    });

    console.log(`Servidor corriendo en el puerto ${port}`);
    
  } catch (error) {

    console.error("Error crítico al iniciar la aplicación:", error);
    process.exit(1); 
  }
  
}

main();
import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
} from '@tanstack/react-router';

import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { MyArticlesPage } from '../pages/MyArticlesPage';
import { MenuPage } from '../pages/MenuPage';
import { MainLayout } from '../layout/MainLayout';

import { getSessionRequest } from '../service/account/session';

const rootRoute = createRootRoute({
  component: MainLayout,
});

type HomeSearch = {
  page?: number;
  author?: string;
  title?: string;
  content?: string;
};

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: (search): HomeSearch => {
    return {
      page: search.page
        ? Number(search.page)
        : undefined,

      author: search.author
        ? String(search.author)
        : undefined,

      title: search.title
        ? String(search.title)
        : undefined,

      content: search.content
        ? String(search.content)
        : undefined,
    };
  },
  component: MenuPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
  beforeLoad: async () => {
    const session = await getSessionRequest();

    if (session) {
      throw redirect({
        to: '/my-articles',
      });
    }
  },
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
  beforeLoad: async () => {
    const session = await getSessionRequest();

    if (session) {
      throw redirect({
        to: '/my-articles',
      });
    }
  },
});

const myArticlesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-articles',
  component: MyArticlesPage,
  beforeLoad: async () => {
    const session = await getSessionRequest();

    if (!session) {
      throw redirect({
        to: '/',
      });
    }
  },
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$',
  beforeLoad: () => {
    throw redirect({
      to: '/',
    });
  },
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
  myArticlesRoute,
  notFoundRoute,
]);

export const router = createRouter({
  routeTree,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
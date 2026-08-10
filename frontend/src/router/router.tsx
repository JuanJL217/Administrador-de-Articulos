import { createRouter, createRootRoute, createRoute, Outlet} from '@tanstack/react-router';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet /> 
    </>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <div className="p-8 text-2xl font-bold"> Acá presentaré todos los articulos publicamente</div>,
});

const routeTree = rootRoute.addChildren([
  homeRoute, 
  loginRoute, 
  registerRoute
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
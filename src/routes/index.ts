import { Router } from 'express'
import { config } from '../config'

// Routes
import gamesRoute from './games.route'

interface Route {
  path: string;
  route: Router;
  middlewares?: { (): void }[];
}

const router = Router()

const setRoutes = (routes: Route[]) => {
  routes.forEach((route) => {
    if (Array.isArray(route.middlewares) && route.middlewares.length) {
      router.use(route.path, ...route.middlewares, route.route)
    } else {
      router.use(route.path, route.route)
    }
  })
}

const defaultRoutes: Route[] = [
  {
    path: '/games',
    route: gamesRoute,
  },
  /*   {
    path: '/route',
    route: routeFile,
    middlewares: [middleware],
  }, */
]

const devRoutes: Route[] = []

setRoutes(defaultRoutes)

if (config.meta.isDev) {
  setRoutes(devRoutes)
}

export default router

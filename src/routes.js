import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// users
routes.get('/users', UserController.all);
routes.post('/users', UserController.store);

// sessions
routes.post('/sessions', SessionController.store);

// autheticated
routes.use(authMiddleware);
routes.put('/users', UserController.update);

export default routes;

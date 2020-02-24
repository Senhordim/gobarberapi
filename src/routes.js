import { Router } from 'express';
import multer, { MulterError } from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// users
routes.get('/users', UserController.all);
routes.post('/users', UserController.store);

// sessions
routes.post('/sessions', SessionController.store);

// authenticated
routes.use(authMiddleware);
routes.put('/users', UserController.update);

// uploads

routes.post('/files', upload.single('file'), FileController.store);

export default routes;

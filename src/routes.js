import { Router } from 'express';
import multer, { MulterError } from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProvidersController from './app/controllers/ProvidersController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';

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

// providers
routes.get('/providers', ProvidersController.index);

// appointment
routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);

// Schedule
routes.get('/schedule', ScheduleController.index);

// Notification
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

// uploads
routes.post('/files', upload.single('file'), FileController.store);

export default routes;

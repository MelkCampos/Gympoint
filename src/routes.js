import { Router } from 'express';

import authMiddleware from './app/middleware/auth';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';


const routes = new Router();

// criação de usuário
routes.post('/users', UserController.store);
// criação de uma sessão
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

// atualizaçãod e dados de usuário
routes.put('/users', UserController.update);



export default routes;

import { Router } from 'express';

import authMiddleware from './app/middleware/auth';
import studentMiddleware from './app/middleware/checkStudentExists';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlansController from './app/controllers/PlansController'

const routes = new Router();

// criação de usuário
routes.post('/users', UserController.store);
// criação de uma sessão
routes.post('/sessions', SessionController.store);


// altenticação de T
routes.use(authMiddleware);




// atualização de dados de usuário
routes.put('/users', UserController.update);

// criação de alunos
routes.post('/students/', StudentController.store);

// atualização de estudante
 routes.put('/students/:id', studentMiddleware, StudentController.update);


 // ROTAS DE PLANOS

 // listagem de planos
routes.get('/plans', PlansController.index);

// criação de planos :)
routes.post('/plans', PlansController.store);

// atualização/modificações de planos
// routes.put('/plans/:id', PlansController.update);

// excluir plano :( 
// routes.delete('/plans/:id', PlansController.delete);



export default routes;

import { Router } from 'express';

import authMiddleware from './app/middleware/auth';
import studentMiddleware from './app/middleware/checkStudentExists';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlansController from './app/controllers/PlansController';
import RegistrationController from './app/controllers/RegistrationController';

const routes = new Router();

// criação de usuário
routes.post('/users', UserController.store);
// criação de uma sessão
routes.post('/sessions', SessionController.store);


// altenticação de T
routes.use(authMiddleware);




// atualização de dados de usuário
routes.put('/users', UserController.update);

// criação de usuário
routes.post('/students/', StudentController.store);

// atualização de usuário
 routes.put('/students/:id', studentMiddleware, StudentController.update);


 // ROTAS DE PLANOS

 // listagem de planos
routes.get('/plans', PlansController.index);

// criação de planos :)
routes.post('/plans', PlansController.store);

// atualização/modificações de planos
routes.put('/plans/:id', PlansController.update);

// excluir plano :( 
routes.delete('/plans/:id', PlansController.delete);



// ROTAS DE REGISTROS DE ALUNOS

 // listagem de matriculas/estudantes
 routes.get('/registrations', RegistrationController.index);

 // criação de matriculas/estudantes :)
 routes.post('/registrations', RegistrationController.store);
 
 // atualização/modificações de matriculas/estudantes
  //routes.put('/registrations/:id', RegistrationController.update);
 
 // excluir matriculas/estudantes :( 
 //routes.delete('/registrations/:id', RegistrationController.delete);
 
 


export default routes;

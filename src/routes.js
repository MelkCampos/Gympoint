import { Router } from 'express';

import authMiddleware from './app/middleware/auth';
import checkStudentExists from './app/middleware/checkStudentExists';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlansController from './app/controllers/PlansController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrdersController from './app/controllers/HelpOrdersController';

const routes = new Router();

// criação de usuário
routes.post('/users', UserController.store);
// criação de uma sessão
routes.post('/sessions', SessionController.store);


// ROTAS DE CHECKIS 
// comparecimento na academia

// listar todos os checkins
routes.get('/students/:id/checkins', CheckinController.show);

// criar checkins
routes.post('/students/:id/checkins', CheckinController.store);

// Listar todos pedidos de auxílio de um usuário com base em seu ID
routes.get('/students/:id/help-orders', HelpOrdersController.show);

//  Rota para o aluno cadastrar pedidos de auxílio apenas informando seu ID
routes.post('/students/:id/help-orders', HelpOrdersController.store);



// altenticação de Token
routes.use(authMiddleware);



// listagem de estduantes não registrados a usu da academia
routes.get('/students', StudentController.index);

// criação de usuário
routes.post('/students', StudentController.store);

// atualização de usuário
 routes.put('/students/:id', checkStudentExists, StudentController.update);


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
routes.put('/registrations/:id', RegistrationController.update);
 
 // excluir matriculas/estudantes :( 
 //routes.delete('/registrations/:id', RegistrationController.delete);
 
 


export default routes;

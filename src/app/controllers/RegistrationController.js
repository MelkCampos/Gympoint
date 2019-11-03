import * as Yup from 'yup';
import { isBefore, addMonths, parseISO, format } from 'date-fns';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

import NewRegistrationMail from '../jobs/NewRegistrationMail';
import Queue from '../../lib/Queue';

class RegistrationController {

  // Listagem de Estudantes
  async index(req, res) {
    const { page = 1 } = req.query;

    const registrations = await Registration.findAll({ 
      order: ['start_date'],
      attributes: ['id', 'start_date', 'end_date', 'price'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
     });

     return res.json(registrations);
  } // index

  // Criação de Novos Estudantes
  async store(req, res) {
    const schema = Yup.object().shape({ 

      student_id: Yup
      .number()
      .integer()
      .required(),

      plan_id: Yup.number()
      .integer()
      .required(),

      start_date: Yup.date().required(),
     });

     if(!(await schema.isValid(req.body))) {
       return res.status(400).json({ error: 'Validation Fails.' });
     }


     const { student_id, plan_id, start_date } = req.body;

     const student = await Student.findOne({ where: { id: student_id } });

     if(!student) {
       return res.status(400).json({ error: 'Student does not exist.' });
     }

     const plan = await Plan.findOne({ where: { id: plan_id } });
     
     if(!plan) {
      return res.status(400).json({ error: 'Plan does not exist.' });
     }

     // hora informanda pelo usuário
     const parsedStartDate = parseISO(start_date); 

     // verificação se horário passado por usuário já não passou
     if(isBefore(parsedStartDate, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited.' });
     }

     const end_date = addMonths(parsedStartDate, plan.duration);

     // calculo com relação as datas
     const price = plan.duration * plan.price;
     
     const formattedStartDate = format(parsedStartDate, 'yyyy-MM-dd');
     const formattedEndDate = format(end_date, 'yyyy-MM-dd');

     const registration = await Registration.create({
       student_id,
       plan_id,
       start_date: formattedStartDate,
       end_date: formattedEndDate,
       price,
     });


     // Envio de email  para o estudante após ele ter feito o cadastro
     await Queue.add(NewRegistrationMail.key, {
       student, 
       plan, 
       registration, 
     }); 


     return res.json({  
        student_id, 
        plan_id, 
        start_date: formattedStartDate, 
        end_date: formattedEndDate, 
        price, 
      });
  } // store

  // atualização de registro
  async update(req, res) {
    const schema = Yup.object().shape({

      student_id: Yup.number().integer(),
      plan_id: Yup.number().integer(),
      start_date: Yup.date(),
    });

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Falils' });
    }

    const registration = await Registration.findByPk(req.params.id);

    const { student_id, plan_id, start_date } = req.body;

    const newStudentId = student_id || registration.student_id;

    const plan = plan_id 
    ? await Plan.findOne({ where: { id: plan_id } })
    : await Plan.findOne({ where: { id: registration.plan_id} });
    
    // atualição de data de início -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    if(start_date) {
      const parsedStartDate = parseISO(start_date);

      if(isBefore(parsedStartDate, new Date())) {
        return res.status(400).json({ error: 'Old dates are not permited' });

    }


    const end_date = addMonths(parsedStartDate, plan.duration)

    const price = plan.duration * plan.price

    const formattedStartDate = format(parsedStartDate, 'yyyy-MM-dd');
    const formattedEndDate = format(end_date, 'yyyy-MM-dd');
    // =-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

     // mostrador de atualizações
    await registration.update({
      student_id: newStudentId,
      plan_id: plan.id,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      price,
    });
  }

    return res.json(registration);
  } // update


  // modo de DELETAR

} 

export default new RegistrationController();
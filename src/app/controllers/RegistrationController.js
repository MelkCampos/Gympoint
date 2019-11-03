import * as Yup from 'yup';
import { isBefore, addMonths, parseISO, format } from 'date-fns';
import Registration from '../models/Registration';
import Student from '../models/Student';
import User from '../models/User';
import Plan from '../models/Plan';

import Mail from '../../lib/Mail';

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
  }

  // Criação de Novos Estudantes
  async store(req, res) {
    const schema = Yup.object().shape({ 
      
      student_id: Yup.number()
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

     const student = await Student.findByPk(req.params.id);

     if(!student) {
       return res.status(400).json({ error: 'Student does not exist.' });
     }

     const plan = await Plan.findByPk(req.params.id);
     
     if(!plan) {
      return res.status(400).json({ error: 'Plan does not exist.' });
     }

     // hora informanda pelo usuário
     const parsedStartDate = parseISO(start_date); 

     // verificação se horário passado por usuário já não passou
     if(isBefore(parsedStartDate), new Date()) {
      return res.status(400).json({ error: 'Past dates are not permited.' });
     }

     const end_date = addMonths(parsedStartDate, plan.duration);

     // calculo com relação as datas
     const price = plan.duration * plan.price;
     
     const formattedStartDate = format(parsedStartDate, 'yyy-MM-dd');
     const formattedEndDate = format(end_date, 'yyy-MM-dd');

     const registrations = await Registration.create({
       student_id,
       plan_id,
       start_date: formattedStartDate,
       end_date: formattedEndDate,
       price,
     });

     return res.json(
        { 
        student_id,
        plan_id,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        price,
      });
  }


  
}

export default new RegistrationController();
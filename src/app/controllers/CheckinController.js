import { subDays } from 'date-fns';
import { Op } from 'sequelize';
import Student from '../models/Student';
import Checkin from '../models/Checkin';


// REGRA DE NEGÓCIO
// O usuário só pode fazer 5 checkins dentro de um período de 7 dias corridos.
class CheckinController {

  async show(req, res) {
    const student = await Student.findByPk(req.params.id);

    if(!student) 
      return res.status(400).json({ error: 'Student does not exist.' });
    

    const checkins = await Checkin.findAll({
      where: { student_id: req.params.id },

      // ordernação de listagem
      order: [['created_at', 'DESC']],
    });

    return res.json(checkins);

  } // show

    // Realizar Checkin

    async store(req, res) {

      const student = await Student.findByPk(req.params.id);

      if(!student) 
        return res.status(400).json({ error: 'Student does not exist.' });

      // checando limite de - [ 5 checkins ] - dentro de - [ 7 dias ] -
      const last7DaysCheckins = await Checkin.findAll({
        where: {
          student_id: req.params.id,
          created_at: {
            [Op.between]: [subDays(new Date(), 7), new Date()],
          },
        },
      });

      if(last7DaysCheckins.length >= 5) {
        return res.status(401).json({
          error: 'You can not checkin more than 5 times in 7 calendar days'
        });
      }

      // criação de chekin
      const checkin = await Checkin.create({ student_id: req.params.id });

      return res.json(checkin);
    } // store


}

export default new CheckinController();
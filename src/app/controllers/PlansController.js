import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {

    // listantem de planos
    async index(req, res) {

      const plans = await Plan.findAll({
        // atributos a serem mostrados na listagem
        attributes: ['id', 'title', 'duration', 'price'],
      });

      return res.json(plans);
    }

    async store(req, res) {
      const schema = Yup.object().shape({
        title: Yup.string().required(),

        // em números de meses
        duration: Yup
        .number()
        .integer()
        .positive()
        .required(), 
        price: Yup
        .number()
        .positive()
        .required(),
      }); 

      if(!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: ' Validation Fails. ' });
      }

      const { id, title, duration, price } = await Plan.create(req.body);

      return res.json({ 
        id,
        title,
        duration,
        price, 
      });
    }
}

export default new PlanController();
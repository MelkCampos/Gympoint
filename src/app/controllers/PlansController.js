import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {

    // Listantem de Planos
    async index(req, res) {

      const plans = await Plan.findAll({
        // atributos a serem mostrados na listagem
        attributes: ['id', 'title', 'duration', 'price'],
      });

      return res.json(plans);
    }

    // Criação de Planos
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
    

    // Update de planos
    async update(req, res){
      // id do planos a ser atualizado
      const plan = await Plan.findByPk(req.params.id);

      if(!plan) {
        return res.status(400).json({ error: 'Plan does not exist.' });
      }

      // dados a serem alterados
      const schema = Yup.object().shape({ 
        title: Yup.string(),
        duration: Yup
        .number()
        .positive(),
        price: Yup.number().positive(),
       });

       if(!(await schema.isValid(req.body))) {

         return res.status(400).json({ error: 'Validation Fails.' });
       }

       const { id, title, duration, price } = await plan.update(req.body);

       return res.json({
        id,
        title,
        duration,
        price
       });
    }

    // Excluir Plano
    async delete(req, res) {
       // id do planos a ser apagado
      const plan = await Plan.findByPk(req.params.id);

      if(!plan) {
        return res.status(400).json({ error: 'Plan does not exist.' });
      }

      // excluindo
      await plan.destroy();

      return res.json(`Plan deleted.`);
    }
}

export default new PlanController();
import * as Yup from 'yup'; 
import Student from '../models/Student';
import HelpOrder from '../models/HelpOrders';

class HelpOrderController {
  async show(req, res) {

    const student = await Student.findByPk(req.params.id);

    if(!student) {
      return res.status(400).json({ error: 'Student does not exist.' });
    }

    const help_orders = await HelpOrder.findAll({
      where: { student_id: req.params.id },
      attributes: ['id', 'question', 'answer', 'answer_at'],
    });
    
    return res.json(help_orders);

  } // show

  async store(req, res) {

    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Student.findByPk(req.params.id);

    if(!student) {
      return res.status(400).json({ error: 'Student does not exist.' });
    }

    const { question } = req.body;

    await HelpOrder.create({
      student_id: req.params.id,
      question,
    });

    return res.json({
      student_id: req.params.id,
      question,
    });

  }
}

export default new HelpOrderController();
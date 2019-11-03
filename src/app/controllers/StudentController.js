import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {

  // listagem de estudantes (não registrados)
  async index(req, res){
    const students = await Student.findAll({
          // atributos a serem mostrados na listagem
          attributes: ['id','name', 'email'],
    });

    return res.json(students);
  }


  async store(req, res) {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string()
        .email()
        .required(),
        age: Yup.number().required(),
        weight: Yup.number().required(),
        height: Yup.number().required(),
      });

      if(!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation Fails' });
      }

      const studentExists = await Student.findOne({ 
        where: { email: req.body.email }, 
      });


      if(studentExists) {
        return res.status(400).json({ error: 'Student already exists.' });
      }


       const { id, name, email, age, weight, height } = await Student.create(req.body);

      return res.json({
        id, 
        name,
        email,
        age,
        weight,
        height,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { email } = req.body;

    // pegando chave primaria do Estudante
    // exemplo de representação de rota:
    // routes.update('/students/:id', StudentController.update);
    const student = await Student.findByPk(req.params.id);

    if(email && email !== student.email) {
      const studentExists = await Student.findOne({
         where: { email }
      });

       if(studentExists) {
         return res.status(400).json({ error: 'Students already exists.' });
       }
    }

    const { id, name, age, weight, height } = await student.update(req.body);

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height
    });
  }
}

export default new StudentController();

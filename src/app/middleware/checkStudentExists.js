import Student from '../models/Student';

export default async(req, res, next) => {

    // prucurando estudante pela chave primaria
    const student = await Student.findByPk(req.params.id);

    // verificação se estudante existe
    if(!student) {
      return res.status(400).json({ error: 'Student does not exist.' });
    }
};
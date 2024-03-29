//  usuário se autentique em sua aplicação utilizando e-mail e uma senha.

import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  // store: cadastrar usuário
  async store(req, res) {

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    // validação se o campo está preenchido corretamente
    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validation Fails.' });
    }

    // caso preenchimento esteja correto
    const userExists = await User.findOne({ where: { email: req.body.email } });

    // validação se usuário já existe
    if(userExists) {
      return res.status(400).json({ error: 'User already exists.'  });
    }

    const { id, name, email, administrator } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      administrator 
    });

  }

  async update(req, res) {

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),

      // when: validação condicional
      // se a variavel "oldPassword" for preenchida
      // é precisso preecher a variavel "password" seja obrigatorio
      password: Yup.string().min(6).when('oldPassword', (oldPassword, field) => 

        oldPassword ? field.required() : field
      ),

       // confirmação de nova senha [ em casos de updates de senha ]

      confirmPassword: Yup.string().min(6).when('password', (password, field) => 

        password ? field.required().oneOf([ Yup.ref('password') ]) : field
      ),
    });

    
    // validação se o"req.body" está pegando a validação acima
    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validation Fails.' });
    }

    
    const { email, oldPassword } = req.body;
    
    const user = await User.findByPk(req.userId);


    // checagem se e-mail já é existente no sistema
    if(email !== user.email) {

      const userExists = await User.findOne({ where: { email } });

      if(userExists) {

        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    // validação de senha de usuário
    // validando se senha passada pelo usuário
    // para fazer update, é a mesma salva no BD
    if(oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not macth.' });
    }


    const { id, name, provider } =  await user.update(req.body);

    return res.json({ 
      id,
      name,
      email,
      provider 
    });
  }
  
}

export default new UserController();
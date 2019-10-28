import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';


class User extends Model{

  static init(sequelize){
    super.init({
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        administrator: Sequelize.BOOLEAN,

    },
    
      {
        sequelize
      }
    );

      this.addHook('beforeSave', async user => {
        if(user.password) {
          user.password_hash = await bcrypt.hash(user.password, 8);
        }
      });

      return this;
  }

  checkPassword(password) {
    // password: senha passada pelo usuario
    // password_hash: senha gravada no banco de dados
    // realiza a comparação entre as duas

    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
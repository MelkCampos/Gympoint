'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.createTable('registrations', { 

      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      // id de estudante
      student_id: {
        type: Sequelize.INTEGER,
        references: { model: 'students', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },

      // id do plano escolhido
      plan_id: {
        type: Sequelize.INTEGER,
        references: { model: 'plans', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },

      // date de inicio 
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      // data de finalização
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      // preço total calculado na data da matrícula até "end_date" (termino)
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

     });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('registrations');
  }
};

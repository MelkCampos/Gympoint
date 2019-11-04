'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable("help_orders", {

        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },

        student_id: {
          type: Sequelize.INTEGER,
          references: { model: 'students', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false,
        },

        // quetão do usuário
        question: {
          type: Sequelize.TEXT,
          allowNull: false,
        },

        // resposta da academia 
        answer: {
          type: Sequelize.TEXT,
          default: null,
        },

        // data da resposta da academia
        answer_at: {
          type: Sequelize.DATE,
          default: null,
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
   return queryInterface.dropTable("help_orders");
  }
};

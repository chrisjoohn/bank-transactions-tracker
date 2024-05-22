'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bt_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      unique_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },

      first_name: {
        type: Sequelize.STRING(50),
      },

      last_name: {
        type: Sequelize.STRING(50),
      },

      email: {
        type: Sequelize.STRING(50),
      },

      created_by: {
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_by: {
        type: Sequelize.INTEGER,
      },
      updated_at: {
        allowNull: false,
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ),
      },

      archived_by: {
        type: Sequelize.INTEGER,
      },
      archived_at: {
        type: 'TIMESTAMP',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bt_users');
  },
};

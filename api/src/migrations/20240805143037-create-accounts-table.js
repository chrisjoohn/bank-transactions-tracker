'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bt_accounts', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      unique_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },

      user_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING(50),
      },

      description: {
        type: Sequelize.STRING(100),
      },

      type: {
        type: Sequelize.ENUM,
        values: ['DEPOSIT', 'CREDIT'],
        defaultValue: 'DEPOSIT',
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
    await queryInterface.dropTable('bt_accounts');
  },
};

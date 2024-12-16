'use strict';

const TABLE_NAME = 'bt_debit_transactions';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(TABLE_NAME, {
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
      account_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'bt_accounts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      description: {
        type: Sequelize.STRING(100),
      },
      transaction_date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      transaction_type: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['DEPOSIT', 'CREDIT'],
        defaultValue: 'DEPOSIT',
      },
      amount: {
        allowNull: false,
        type: Sequelize.FLOAT,
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
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  }
};

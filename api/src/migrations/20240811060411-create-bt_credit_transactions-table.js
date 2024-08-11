'use strict';

const TABLE_NAME = 'bt_credit_transactions';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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

      post_date: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      amount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.dropTable(TABLE_NAME);
  },
};

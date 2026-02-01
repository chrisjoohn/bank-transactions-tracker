'use strict';

const TABLE_NAME = 'bt_account_tag_charts';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(TABLE_NAME, {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
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

      tag_chart_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'bt_tag_charts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 99,
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
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

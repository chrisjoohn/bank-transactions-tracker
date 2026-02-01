'use strict';

const TABLE_NAME = 'bt_tag_charts';

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

      title: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      data: {
        type: Sequelize.JSON,
        allowNull: false,
      },

      pre_filter: {
        type: Sequelize.JSON,
      },

      series: {
        type: Sequelize.JSON,
        allowNull: false,
      },

      chart_type: {
        type: Sequelize.ENUM,
        values: ['BAR', 'LINE'],
        allowNull: false,
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

  async down(queryInterface) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};

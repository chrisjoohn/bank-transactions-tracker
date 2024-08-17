'use strict';

const TABLE_NAME='bt_tags';

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

      user_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING(50),
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

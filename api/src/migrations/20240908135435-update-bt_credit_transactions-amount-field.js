'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('bt_credit_transactions', 'amount', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('bt_credit_transactions', 'amount', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },
};

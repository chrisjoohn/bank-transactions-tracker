'use strict';

const BaseModel = require('./baseModel');

module.exports = (sequelize, DataTypes) => {
  class DebitTransactions extends BaseModel {
    constructor() {
      super(sequelize, DataTypes);

      this.account_id = {
        type: DataTypes.INTEGER,
        allowNull: false,
      };
      this.description = {
        type: DataTypes.STRING(100),
      };
      this.transaction_date = {
        type: DataTypes.STRING(100),
      };
      this.transaction_type = {
        type: DataTypes.ENUM,
        values: ['DEPOSIT', 'CREDIT'],
        defaultValue: 'DEPOSIT',
      };
      this.amount = {
        type: DataTypes.FLOAT,
      };
    }
  }

  let Model = sequelize.define(
    'bt_debit_transactions',
    new DebitTransactions()
  );

  Model.associate = (models) => {};

  return Model;
};

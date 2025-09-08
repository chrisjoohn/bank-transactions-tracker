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
        values: ['INFLOW', 'OUTFLOW'],
        defaultValue: 'INFLOW',
      };
      this.amount = {
        type: DataTypes.FLOAT,
      };
    }
  }

  let Model = sequelize.define('bt_debit_transactions', new DebitTransactions());

  Model.associate = (models) => {
    Model.belongsToMany(models.tags, {
      through: models.debit_transaction_tags,
      foreignKey: 'debit_transaction_id',
      otherKey: 'tag_id',
      as: 'tags',
    });
  };

  return Model;
};

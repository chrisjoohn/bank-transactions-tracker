'use strict';

const BaseModel = require('./baseModel');

module.exports = (sequelize, DataTypes) => {
  class CreditTransactions extends BaseModel {
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

      this.post_date = {
        type: DataTypes.STRING(100),
      };

      this.amount = {
        type: DataTypes.FLOAT,
      };
    }
  }

  let Model = sequelize.define('bt_credit_transactions', new CreditTransactions());

  Model.associate = (models) => {
    Model.belongsToMany(models.tags, {
      through: models.credit_transaction_tags,
      foreignKey: 'credit_transaction_id',
      otherKey: 'tag_id',
      as: 'tags',
    })
  };

  return Model;
};

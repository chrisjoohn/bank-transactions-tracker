'use strict';

const BaseModel = require('./baseModel');

module.exports = (sequelize, DataTypes) => {
  class DebitTransactionTags extends BaseModel {
    constructor() {
      super(sequelize, DataTypes);

      this.tag_id = {
        type: DataTypes.INTEGER,
        allowNull: false,
      };
      this.debit_transaction_id = {
        type: DataTypes.INTEGER,
        allowNull: false,
      };
    }
  }

  let Model = sequelize.define('bt_debit_transaction_tags', new DebitTransactionTags());

  Model.associate = (models) => {
    Model.hasOne(models.tags, {
      foreignKey: 'id',
      sourceKey: 'tag_id',
      as: 'tag',
    });

    Model.hasOne(models.debit_transactions, {
      foreignKey: 'id',
      sourceKey: 'debit_transaction_id',
    });
  };

  return Model;
};

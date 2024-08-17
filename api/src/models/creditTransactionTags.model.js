'use strict';

const BaseModel = require('./baseModel');

module.exports = (sequelize, DataTypes) => {
  class CreditTransactionTags extends BaseModel {
    constructor() {
      super(sequelize, DataTypes);

      this.tag_id = {
	type: DataTypes.INTEGER,
        allowNull: false,
      };

      this.credit_transaction_id = {
	type: DataTypes.INTEGER,
	allowNull: false,
      }
    }
  }

  let Model = sequelize.define('bt_credit_transaction_tags', new CreditTransactionTags());

  Model.associate = (models) => {};

  return Model;
};

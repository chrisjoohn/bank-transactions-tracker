'use strict';

const BaseModel = require('./baseModel');

module.exports = (sequelize, DataTypes) => {
  class Tags extends BaseModel {
    constructor() {
      super(sequelize, DataTypes);

      this.user_id = {
        type: DataTypes.STRING(50),
        allowNull: false,
      };

      this.name = {
        type: DataTypes.STRING(50),
      };
    }
  }

  let Model = sequelize.define('bt_tags', new Tags());

  Model.associate = (models) => {
    Model.belongsToMany(models.credit_transactions, {
      through: models.credit_transaction_tags,
      foreignKey: 'tag_id',
      otherKey: 'credit_transaction_id',
    });
  };

  return Model;
};

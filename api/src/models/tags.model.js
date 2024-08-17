'use strict';

const BaseModel = require('./baseModel');

module.exports = (sequelize, DataTypes) => {
  class Accounts extends BaseModel {
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

  let Model = sequelize.define('bt_accounts', new Accounts());

  Model.associate = (models) => {};

  return Model;
};

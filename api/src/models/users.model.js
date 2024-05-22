'use strict';

const BaseModel = require('./baseModel');

module.exports = (sequelize, DataTypes) => {
  class Users extends BaseModel {
    constructor() {
      super(sequelize, DataTypes);

      this.first_name = {
        type: DataTypes.STRING(50),
      };

      this.last_name = {
        type: DataTypes.STRING(50),
      };

      this.email = {
        type: DataTypes.STRING(50),
      };
    }
  }

  let Model = sequelize.define('bt_users', new Users());

  Model.associate = (models) => {};

  return Model;
};

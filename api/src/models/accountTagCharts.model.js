'use strict';

const BaseModel = require('./baseModel');

module.exports = (sequelize, DataTypes) => {
  class AccountTagCharts extends BaseModel {
    constructor() {
      super(sequelize, DataTypes);

      this.accountId = {
        field: 'account_id',
        type: DataTypes.INTEGER,
        allowNull: false,
      };

      this.tagChartId = {
        field: 'tag_chart_id',
        type: DataTypes.INTEGER,
        allowNull: false,
      };

      this.priority = {
        type: DataTypes.INTEGER,
        allowNull: false,
      };
    }
  }

  let Model = sequelize.define('bt_account_tag_charts', new AccountTagCharts());

  Model.associate = (models) => {};

  return Model;
};

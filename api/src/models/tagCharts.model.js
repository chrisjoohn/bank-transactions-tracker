'use strict';

const BaseModel = require('./baseModel');

module.exports = (sequelize, DataTypes) => {
  class TagCharts extends BaseModel {
    constructor() {
      super(sequelize, DataTypes);

      this.title = {
        type: DataTypes.STRING(50),
        allowNull: false,
      };

      this.chartType = {
        field: 'chart_type',
        type: DataTypes.ENUM,
        values: ['BAR', 'LINE'],
        allowNull: false,
      };

      this.data = {
        type: DataTypes.JSON,
        allowNull: false,
      };

      this.preFilter = {
        field: 'pre_filter',
        type: DataTypes.JSON,
        allowNull: false,
      };

      this.series = {
        type: DataTypes.JSON,
      };
    }
  }

  let Model = sequelize.define('bt_tag_charts', new TagCharts());

  Model.associate = (models) => {
    Model.hasMany(models.account_tag_charts, {
      sourceKey: 'id',
      foreignKey: 'tag_chart_id'
    });
  };

  return Model;
};

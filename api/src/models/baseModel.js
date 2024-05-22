'use strict';

class BaseModel {
  constructor(sequelize, DataTypes) {
    this.unique_code = {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    };
    this.created_by = {
      type: DataTypes.INTEGER,
    };

    this.created_at = {
      type: 'TIMESTAMP',
      allowNull: false,
    };

    this.updated_by = {
      type: DataTypes.INTEGER,
    };
    this.updated_at = {
      type: 'TIMESTAMP',
      allowNull: false,
    };

    this.archived_by = {
      type: DataTypes.INTEGER,
    };
    this.archived_at = {
      type: 'TIMESTAMP',
    };
  }
}

module.exports = BaseModel;

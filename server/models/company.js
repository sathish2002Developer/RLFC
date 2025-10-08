"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Company.hasMany(models.Branch, {
      //   foreignKey: "company_id",
      //   as: "branches",
      // });
      Company.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      Company.belongsTo(models.User, {
        foreignKey: "modified_by",
        as: "modifier",
      });
      Company.belongsTo(models.User, {
        foreignKey: "deleted_by",
        as: "deleter",
      });
    }
  }
  Company.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      company_name: DataTypes.STRING(85),
      company_website: DataTypes.STRING(85),
      company_logo: DataTypes.STRING(),
      default_template: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
      created_by: {
        type: DataTypes.UUID,
        defaultValue: null,
      },
      modified_by: {
        type: DataTypes.UUID,
        defaultValue: null,
      },
      deleted_by: {
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      modelName: "Company",
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
      deletedAt: "deleted_at",
    }
  );
  return Company;
};

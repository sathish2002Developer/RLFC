"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // // define association here
      // Branch.belongsTo(models.Company, {
      //   foreignKey: "company_id",
      //   as: "company",
      // });
      Branch.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      Branch.belongsTo(models.User, {
        foreignKey: "modified_by",
        as: "modifier",
      });
      Branch.belongsTo(models.User, {
        foreignKey: "deleted_by",
        as: "deleter",
      });
    }
  }
  Branch.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      branch_name: DataTypes.STRING(100),
      branch_address: DataTypes.TEXT,
      google_map_link: DataTypes.TEXT,
      // company_id: {
      //   type: DataTypes.UUID,
      //   defaultValue: null,
      // },
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
      modelName: "Branch",
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
      deletedAt: "deleted_at",
    }
  );
  return Branch;
};

"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class PrintEmployee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PrintEmployee.belongsTo(models.Employee, {
        foreignKey: "employee_id",
        as: "employee",
      });
      PrintEmployee.belongsTo(models.PrintRequest, {
        foreignKey: "request_id",
        as: "request",
      });
      PrintEmployee.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      PrintEmployee.belongsTo(models.User, {
        foreignKey: "modified_by",
        as: "modifier",
      });
      PrintEmployee.belongsTo(models.User, {
        foreignKey: "deleted_by",
        as: "deleter",
      });
    }
  }
  PrintEmployee.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      employee_id: {
        type: DataTypes.UUID,
        defaultValue: null,
      },
      request_id: {
        type: DataTypes.UUID,
        defaultValue: null,
      },
      status: {
        type: DataTypes.ENUM("approved", "pending", "rejected"),
        defaultValue: "pending",
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
      modelName: "PrintEmployee",
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
      deletedAt: "deleted_at",
    }
  );
  return PrintEmployee;
};

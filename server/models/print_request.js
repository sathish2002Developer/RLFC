"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class PrintRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PrintRequest.hasMany(models.PrintEmployee, {
        foreignKey: "request_id",
        as: "employees",
      });
      PrintRequest.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      PrintRequest.belongsTo(models.User, {
        foreignKey: "modified_by",
        as: "modifier",
      });
      PrintRequest.belongsTo(models.User, {
        foreignKey: "deleted_by",
        as: "deleter",
      });
    }
  }
  PrintRequest.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      support_document: DataTypes.STRING(50),
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
      modelName: "PrintRequest",
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
      deletedAt: "deleted_at",
    }
  );
  return PrintRequest;
};

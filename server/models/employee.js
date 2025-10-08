"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Employee.belongsTo(models.Company, {
        foreignKey: "company_id",
        as: "company",
      });
      Employee.belongsTo(models.Branch, {
        foreignKey: "branch_id",
        as: "Branch",
      });
      Employee.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
      Employee.belongsTo(models.User, {
        foreignKey: "modified_by",
        as: "modifier",
      });
      Employee.belongsTo(models.User, {
        foreignKey: "deleted_by",
        as: "deleter",
      });
    }
  }
  Employee.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      employee_id: {
        type: DataTypes.STRING(15),
        unique: true,
        allowNull: false,
      },
      employee_name: DataTypes.STRING(85),
      designation: DataTypes.STRING(100),
      mobile_number: DataTypes.STRING(20),
      landline: DataTypes.STRING(20),
      email: DataTypes.STRING(100),
      photo: DataTypes.STRING(50),
      qr_code: DataTypes.STRING(50),
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
      is_adrenalin: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      company_id: {
        type: DataTypes.UUID,
        defaultValue: null,
      },
      branch_id: {
        type: DataTypes.UUID,
        defaultValue: null,
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
      modelName: "Employee",
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
      deletedAt: "deleted_at",
    }
  );
  return Employee;
};

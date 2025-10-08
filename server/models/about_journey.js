"use strict";

module.exports = (sequelize, DataTypes) => {
  const AboutJourney = sequelize.define(
    "AboutJourney",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      summary: { type: DataTypes.TEXT, allowNull: true },
      image: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: "about_journey", underscored: true }
  );
  return AboutJourney;
};

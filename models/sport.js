// sport.js

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sport extends Model {
    static associate(models) {
      Sport.belongsTo(models.Admin, { foreignKey: 'adminId', as: 'creator' });
      Sport.hasMany(models.Session, { foreignKey: 'sportId', onDelete: 'CASCADE' });
    }
  }

  Sport.init(
    {
      adminId: DataTypes.INTEGER,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Sport',
    }
  );

  return Sport;
};

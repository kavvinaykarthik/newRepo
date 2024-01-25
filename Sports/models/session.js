// session.js

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      Session.belongsTo(models.Sport, { foreignKey: 'sportId', onDelete: 'CASCADE' });
    }
  }
  Session.init(
    {
      sportId: DataTypes.INTEGER,
      creator: DataTypes.STRING,
      date: DataTypes.DATE,
      time: DataTypes.TIME,
      venue: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Session',
    }
  );
  return Session;
};

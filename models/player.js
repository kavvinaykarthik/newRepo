'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    static associate(models) {
      // define association here
    }

    static async createPlayer({ firstName, lastName, email, password }) {
      try {
        const player = await Player.create({
          firstName,
          lastName,
          email,
          password,
        });

        return player;
      } catch (error) {
        throw new Error(`Error creating player: ${error.message}`);
      }
    }
  }

  Player.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Player',
  });

  return Player;
};

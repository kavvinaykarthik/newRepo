'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Admin.hasMany(models.Sport, { foreignKey: 'adminId', as: 'createdSports' });
    }
    static async getById (adminId) {
      try {
        const admin = await this.findByPk(adminId);
        return admin;
      } catch (error) {
        console.error('Error retrieving admin by ID:', error);
        throw error;
      }
    };
    static async createAdmin(firstName, lastName, email, password) {
      try {
        const admin = await this.create({
          firstName,
          lastName,
          email,
          password,
        });

        // You can perform additional actions or validations here if needed

        return admin;
      } catch (error) {
        console.error('Error creating admin:', error);
        throw error;
      }
    }
  }

  Admin.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Admin',
  });

  return Admin;
};

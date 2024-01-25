'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.addColumn('Sessions', 'venue', { type: Sequelize.STRING });
     */
    await queryInterface.addColumn('Sessions', 'venue', { type: Sequelize.STRING });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.removeColumn('Sessions', 'venue');
     */
    await queryInterface.removeColumn('Sessions', 'venue');
  }
};

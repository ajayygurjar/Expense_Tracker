'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Expenses', 'note', {
      type: Sequelize.STRING,
      allowNull: true, // note is optional
      // after: 'description', // optional, MySQL only
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Expenses', 'note');
  }
};

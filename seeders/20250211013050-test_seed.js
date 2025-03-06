'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tags', [
      {
        name: 'Node.js',
        color: '#68A063',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Express',
        color: '#4E9A06',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'JavaScript',
        color: '#FCE94F',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'React',
        color: '#729FCF',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'PostgreSQL',
        color: '#AD7FA8',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tags', null, {});
  }
};

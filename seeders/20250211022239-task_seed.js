'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Tasks', [
      {
        title: 'Aprender Node.js',
        description: 'Aprender os conceitos básicos de Node.js',
        status: 'Em andamento',
        priority: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Aprender React.js',
        description: 'Aprender os conceitos básicos de React.js',
        status: 'Em andamento',
        priority: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Aprender Laravel',
        description: 'Aprender os conceitos básicos de Laravel',
        priority: 5,
        status: 'Finalizado',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Tasks', null, {});
  }
};

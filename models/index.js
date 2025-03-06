const { Sequelize } = require('sequelize');

const UserModel = require('./user');
const TaskModel = require('./Task');
const TagModel = require('./Tag');

const sequelize = new Sequelize('desafio_db', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres', // Certifique-se de que o dialect está definido corretamente
});

// Definindo os modelos
const User = UserModel(sequelize);
const Task = TaskModel(sequelize);
const Tag = TagModel(sequelize);

// Definindo relacionamentos
Task.belongsToMany(Tag, { through: 'TaskTag', as: 'tags' });
Tag.belongsToMany(Task, { through: 'TaskTag', as: 'tasks' });

// Exportando os modelos
module.exports = {
  sequelize,
  User,
  Task,
  Tag,
};

const { Sequelize } = require('sequelize');

const UserModel = require('./user');
const TaskModel = require('./Task');
const TagModel = require('./Tag');

const sequelize = new Sequelize('desafio_db', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres',
});

const User = UserModel(sequelize);
const Task = TaskModel(sequelize);
const Tag = TagModel(sequelize);

Task.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Task, { foreignKey: 'userId' });

Tag.belongsTo(User, { foreignKey: 'userId' }); 
User.hasMany(Tag, { foreignKey: 'userId' }); 

Task.belongsToMany(Tag, { through: 'TaskTag', as: 'tags' });
Tag.belongsToMany(Task, { through: 'TaskTag', as: 'tasks' });

module.exports = {
  sequelize,
  User,
  Task,
  Tag,
};
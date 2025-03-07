const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  });

  Tag.associate = (models) => {
    Tag.belongsTo(models.User, { foreignKey: 'userId' });
    Tag.belongsToMany(models.Task, { through: 'TaskTag', as: 'tasks' });
  };

  return Tag;
};
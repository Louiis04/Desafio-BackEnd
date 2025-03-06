'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaskTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  }
  TaskTag.init({
    TaskId: DataTypes.INTEGER,
    TagId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TaskTag',
  });
  return TaskTag;
};
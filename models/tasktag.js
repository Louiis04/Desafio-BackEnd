'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaskTag extends Model {
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
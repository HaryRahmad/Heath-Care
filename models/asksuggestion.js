'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AskSuggestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AskSuggestion.belongsTo(models.Doctor)
      AskSuggestion.belongsTo(models.User)
    }
  }
  AskSuggestion.init({
    asking: DataTypes.STRING,
    suggestion: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    DoctorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AskSuggestion',
  });
  return AskSuggestion;
};
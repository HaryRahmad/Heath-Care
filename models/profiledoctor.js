'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProfileDoctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProfileDoctor.belongsTo(models.Doctor)
    }
  }
  ProfileDoctor.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    age: DataTypes.INTEGER,
    DoctorId: DataTypes.INTEGER,
    profilePicture: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'ProfileDoctor',
  });
  return ProfileDoctor;
};